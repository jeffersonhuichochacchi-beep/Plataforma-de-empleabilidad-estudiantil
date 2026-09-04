package com.elp.postulaciones_service.service;

import com.elp.postulaciones_service.client.OfertasClient;
import com.elp.postulaciones_service.client.UsuariosClient;
import com.elp.postulaciones_service.dto.ResultadoEvaluacionDTO;
import com.elp.postulaciones_service.dto.externo.OfertaResumenDTO;
import com.elp.postulaciones_service.dto.postulacion.PostulacionRequest;
import com.elp.postulaciones_service.dto.postulacion.PostulacionResponse;
import com.elp.postulaciones_service.exception.BusinessException;
import com.elp.postulaciones_service.exception.DuplicatePostulationException;
import com.elp.postulaciones_service.exception.ForbiddenException;
import com.elp.postulaciones_service.exception.ResourceNotFoundException;
import com.elp.postulaciones_service.mapper.PostulacionMapper;
import com.elp.postulaciones_service.model.AuditoriaPostulacion;
import com.elp.postulaciones_service.model.HistorialPostulacion;
import com.elp.postulaciones_service.model.Postulacion;
import com.elp.postulaciones_service.model.enums.EstadoPostulacion;
import com.elp.postulaciones_service.repository.AuditoriaPostulacionRepository;
import com.elp.postulaciones_service.repository.HistorialPostulacionRepository;
import com.elp.postulaciones_service.repository.PostulacionRepository;
import com.elp.postulaciones_service.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostulacionServiceImpl implements PostulacionService {

    private final PostulacionRepository postulacionRepository;
    private final HistorialPostulacionRepository historialRepository;
    private final AuditoriaPostulacionRepository auditoriaRepository;
    private final EstadoPostulacionService estadoPostulacionService;
    private final PostulacionMapper postulacionMapper;
    
    private final OfertasClient ofertasClient;
    private final UsuariosClient usuariosClient;
    
    // Servicios nuevos para CV
    private final CloudinaryService cloudinaryService;
    private final GeminiAiService geminiAiService;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();

    @Override
    @Transactional
    public PostulacionResponse crearPostulacion(UUID candidatoId, PostulacionRequest request, MultipartFile cvFile) {
        log.info("Iniciando creación de postulación para candidato {} en oferta {}", candidatoId, request.getOfertaId());
        
        // Validar que no exista postulación duplicada
        if (postulacionRepository.existsByCandidatoIdAndOfertaId(candidatoId, request.getOfertaId())) {
            throw new DuplicatePostulationException("El candidato ya tiene una postulacion activa para esta oferta.");
        }

        String jwt = SecurityUtils.getJwtToken();

        // 1. Validar existencia del candidato
        usuariosClient.obtenerResumenCandidato(candidatoId, jwt);

        // 2. Validar oferta y obtener información
        OfertaResumenDTO oferta = ofertasClient.validarOferta(request.getOfertaId(), jwt);
        if (!Boolean.TRUE.equals(oferta.getAceptaPostulaciones()) || 
            (!"ACTIVA".equals(oferta.getEstado()) && !"PUBLICADA".equals(oferta.getEstado()))) {
            throw new BusinessException("La oferta no acepta postulaciones actualmente.");
        }
        if (!oferta.getEmpresaId().equals(request.getEmpresaId())) {
            throw new BusinessException("Discrepancia en la empresa: la oferta no pertenece a la empresa indicada.");
        }

        // 3. Crear entidad de postulación
        Postulacion postulacion = new Postulacion();
        postulacion.setCandidatoId(candidatoId);
        postulacion.setOfertaId(request.getOfertaId());
        postulacion.setEmpresaId(request.getEmpresaId());
        postulacion.setCartaPresentacion(request.getCartaPresentacion());
        postulacion.setEstado(EstadoPostulacion.ENVIADA);

        // 4. Procesar CV si está presente
        if (cvFile != null && !cvFile.isEmpty()) {
            try {
                log.info("Procesando CV para postulación...");
                
                // 4a. Subir CV a Cloudinary
                String cvUrl = cloudinaryService.subirCv(cvFile);
                postulacion.setCvUrl(cvUrl);
                log.info("CV subido exitosamente a: {}", cvUrl);
                
                // 4b. Evaluar CV con IA (solo si hay descripción en la oferta)
                if (oferta.getDescripcion() != null && !oferta.getDescripcion().isBlank()) {
                    try {
                        log.info("Evaluando CV con IA...");
                        ResultadoEvaluacionDTO evaluacion = geminiAiService.evaluarCvContraPerfil(
                            cvFile, 
                            construirPerfilOferta(oferta)
                        );
                        
                        // Guardar resultados de evaluación
                        postulacion.setCumpleRequerimientos(evaluacion.isCumpleRequerimientos());
                        postulacion.setPorcentajeCoincidencia(evaluacion.getPorcentajeCoincidencia());
                        postulacion.setResumenIa(evaluacion.getResumenEvaluacion());
                        postulacion.setHabilidadesEncontradas(evaluacion.getHabilidadesEncontradas());
                        
                        log.info("Evaluación completada: {}% coincidencia", evaluacion.getPorcentajeCoincidencia());
                    } catch (Exception e) {
                        log.error("Error al evaluar CV con IA (continuando sin evaluación): {}", e.getMessage());
                        // No lanzamos excepción, la postulación continúa sin evaluación IA
                    }
                } else {
                    log.info("Oferta sin descripción, omitiendo evaluación con IA");
                }
                
            } catch (Exception e) {
                log.error("Error al procesar CV: {}", e.getMessage(), e);
                throw new BusinessException("Error al procesar el archivo CV: " + e.getMessage());
            }
        } else {
            log.warn("No se proporcionó archivo CV para la postulación");
            // Usar URL del request si existe (compatibilidad con versión anterior)
            postulacion.setCvUrl(request.getCvUrl());
        }

        // 5. Guardar postulación
        try {
            postulacion = postulacionRepository.saveAndFlush(postulacion);
            log.info("Postulación creada exitosamente con ID: {}", postulacion.getUuid());
        } catch (DataIntegrityViolationException e) {
            throw new DuplicatePostulationException("El candidato ya tiene una postulacion activa para esta oferta.");
        }

        // 6. Registrar historial y auditoría
        registrarHistorial(postulacion, null, EstadoPostulacion.ENVIADA, candidatoId, "Postulacion creada inicialmente");
        registrarAuditoria(candidatoId, "POSTULACION_CREADA", "Postulacion creada para oferta " + request.getOfertaId());

        return postulacionMapper.toResponse(postulacion);
    }

    /**
     * Construye un perfil descriptivo de la oferta para la evaluación con IA
     */
    private String construirPerfilOferta(OfertaResumenDTO oferta) {
        StringBuilder perfil = new StringBuilder();
        perfil.append("TÍTULO DEL PUESTO: ").append(oferta.getTitulo()).append("\n\n");
        
        if (oferta.getDescripcion() != null) {
            perfil.append("DESCRIPCIÓN:\n").append(oferta.getDescripcion()).append("\n\n");
        }
        
        if (oferta.getAreaProfesional() != null) {
            perfil.append("ÁREA PROFESIONAL: ").append(oferta.getAreaProfesional()).append("\n");
        }
        
        if (oferta.getNivelExperiencia() != null) {
            perfil.append("NIVEL DE EXPERIENCIA REQUERIDO: ").append(oferta.getNivelExperiencia()).append("\n");
        }
        
        if (oferta.getModalidad() != null) {
            perfil.append("MODALIDAD: ").append(oferta.getModalidad()).append("\n");
        }
        
        return perfil.toString();
    }

    @Override
    @Transactional(readOnly = true)
    public PostulacionResponse obtenerPostulacion(UUID uuid, UUID usuarioLogueadoId, String rolUsuario) {
        Postulacion postulacion = buscarPorUuid(uuid);
        validarIdor(postulacion, usuarioLogueadoId, rolUsuario);
        return postulacionMapper.toResponse(postulacion);
    }

    @Override
    @Transactional
    public PostulacionResponse cambiarEstado(UUID uuid, EstadoPostulacion nuevoEstado, UUID usuarioLogueadoId, String comentario) {
        Postulacion postulacion = buscarPorUuid(uuid);
        EstadoPostulacion estadoAnterior = postulacion.getEstado();
        
        estadoPostulacionService.validarTransicion(estadoAnterior, nuevoEstado);
        
        postulacion.setEstado(nuevoEstado);
        postulacion = postulacionRepository.save(postulacion);
        
        registrarHistorial(postulacion, estadoAnterior, nuevoEstado, usuarioLogueadoId, comentario);
        registrarAuditoria(usuarioLogueadoId, "ESTADO_CAMBIADO", "Estado de postulacion " + uuid + " cambiado a " + nuevoEstado);
        
        return postulacionMapper.toResponse(postulacion);
    }

    @Override
    @Transactional
    public PostulacionResponse retirarPostulacion(UUID uuid, UUID candidatoId, String motivo) {
        Postulacion postulacion = buscarPorUuid(uuid);
        
        if (!postulacion.getCandidatoId().equals(candidatoId)) {
            throw new ForbiddenException("No tienes permiso para retirar esta postulacion");
        }

        EstadoPostulacion estadoAnterior = postulacion.getEstado();
        estadoPostulacionService.validarTransicion(estadoAnterior, EstadoPostulacion.RETIRADA);
        
        postulacion.setEstado(EstadoPostulacion.RETIRADA);
        postulacion = postulacionRepository.save(postulacion);
        
        registrarHistorial(postulacion, estadoAnterior, EstadoPostulacion.RETIRADA, candidatoId, motivo != null ? motivo : "Postulacion retirada por el candidato");
        registrarAuditoria(candidatoId, "POSTULACION_RETIRADA", "Postulacion " + uuid + " retirada");
        
        return postulacionMapper.toResponse(postulacion);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostulacionResponse> listarMisPostulaciones(UUID candidatoId, EstadoPostulacion estado, Pageable pageable) {
        Page<Postulacion> postulaciones;
        if (estado != null) {
            postulaciones = postulacionRepository.findByCandidatoIdAndEstado(candidatoId, estado, pageable);
        } else {
            postulaciones = postulacionRepository.findByCandidatoId(candidatoId, pageable);
        }
        String jwt = SecurityUtils.getJwtToken();
        return postulaciones.map(p -> enriquecerPostulacion(p, jwt));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostulacionResponse> listarPostulacionesPorOferta(UUID ofertaId, UUID empresaIdLogueada, EstadoPostulacion estado, Pageable pageable) {
        Page<Postulacion> postulaciones;
        if (estado != null) {
            postulaciones = postulacionRepository.findByOfertaIdAndEmpresaIdAndEstado(ofertaId, empresaIdLogueada, estado, pageable);
        } else {
            postulaciones = postulacionRepository.findByOfertaIdAndEmpresaId(ofertaId, empresaIdLogueada, pageable);
        }
        String jwt = SecurityUtils.getJwtToken();
        return postulaciones.map(p -> enriquecerPostulacion(p, jwt));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostulacionResponse> listarPostulacionesPorEmpresa(UUID empresaIdLogueada, UUID ofertaId, EstadoPostulacion estado, Pageable pageable) {
        Page<Postulacion> postulaciones;
        if (ofertaId != null) {
            if (empresaIdLogueada != null) {
                if (estado != null) {
                    postulaciones = postulacionRepository.findByOfertaIdAndEmpresaIdAndEstado(ofertaId, empresaIdLogueada, estado, pageable);
                } else {
                    postulaciones = postulacionRepository.findByOfertaIdAndEmpresaId(ofertaId, empresaIdLogueada, pageable);
                }
            } else {
                if (estado != null) {
                    postulaciones = postulacionRepository.findByEstado(estado, pageable);
                } else {
                    postulaciones = postulacionRepository.findAll(pageable);
                }
            }
        } else if (empresaIdLogueada != null) {
            if (estado != null) {
                postulaciones = postulacionRepository.findByEmpresaIdAndEstado(empresaIdLogueada, estado, pageable);
            } else {
                postulaciones = postulacionRepository.findByEmpresaId(empresaIdLogueada, pageable);
            }
        } else {
            if (estado != null) {
                postulaciones = postulacionRepository.findByEstado(estado, pageable);
            } else {
                postulaciones = postulacionRepository.findAll(pageable);
            }
        }
        String jwt = SecurityUtils.getJwtToken();
        return postulaciones.map(p -> enriquecerPostulacion(p, jwt));
    }

    private PostulacionResponse enriquecerPostulacion(Postulacion p, String jwt) {
        PostulacionResponse res = postulacionMapper.toResponse(p);
        if (res == null) return null;
        try {
            if (jwt != null && p.getCandidatoId() != null) {
                com.elp.postulaciones_service.dto.externo.UsuarioResumenDTO u = usuariosClient.obtenerResumenCandidato(p.getCandidatoId(), jwt);
                if (u != null) {
                    res.setCandidatoNombre(u.getNombreCompleto());
                    res.setCandidatoEmail(u.getEmail());
                    res.setCandidatoFoto(u.getFotoPerfil());
                }
            }
        } catch (Exception ignored) {}
        try {
            if (jwt != null && p.getOfertaId() != null) {
                OfertaResumenDTO o = ofertasClient.validarOferta(p.getOfertaId(), jwt);
                if (o != null) {
                    res.setOfertaTitulo(o.getTitulo());
                }
            }
        } catch (Exception ignored) {}
        return res;
    }

    private Postulacion buscarPorUuid(UUID uuid) {
        return postulacionRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Postulacion no encontrada"));
    }

    private void validarIdor(Postulacion postulacion, UUID usuarioLogueadoId, String rolUsuario) {
        if ("ESTUDIANTE".equals(rolUsuario) || "PROFESIONAL".equals(rolUsuario) || "CANDIDATO".equals(rolUsuario)) {
            if (!postulacion.getCandidatoId().equals(usuarioLogueadoId)) {
                throw new ForbiddenException("No puedes acceder a las postulaciones de otro candidato");
            }
        } else if ("EMPRESA".equals(rolUsuario) || "RECLUTADOR".equals(rolUsuario)) {
            if (!postulacion.getEmpresaId().equals(usuarioLogueadoId)) {
                throw new ForbiddenException("No puedes acceder a las postulaciones de ofertas de otras empresas");
            }
        }
    }

    private void registrarHistorial(Postulacion postulacion, EstadoPostulacion estadoAnterior, EstadoPostulacion estadoNuevo, UUID usuarioId, String comentario) {
        HistorialPostulacion historial = HistorialPostulacion.builder()
                .postulacion(postulacion)
                .estadoAnterior(estadoAnterior)
                .estadoNuevo(estadoNuevo)
                .usuarioId(usuarioId)
                .comentario(comentario)
                .build();
        historialRepository.save(historial);
    }

    private void registrarAuditoria(UUID usuarioId, String accion, String descripcion) {
        AuditoriaPostulacion auditoria = AuditoriaPostulacion.builder()
                .usuarioId(usuarioId)
                .accion(accion)
                .descripcion(descripcion)
                .build();
        auditoriaRepository.save(auditoria);
    }

    @Override
    public byte[] descargarCv(UUID uuid) {
        Postulacion postulacion = postulacionRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Postulación no encontrada con UUID: " + uuid));

        if (postulacion.getCvUrl() == null || postulacion.getCvUrl().isBlank()) {
            throw new ResourceNotFoundException("Esta postulación no tiene un archivo CV adjunto");
        }

        try {
            log.info("Descargando archivo CV desde Cloudinary: {}", postulacion.getCvUrl());
            Request request = new Request.Builder()
                    .url(postulacion.getCvUrl())
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful() || response.body() == null) {
                    throw new IOException("Error HTTP " + response.code() + " al descargar archivo desde Cloudinary");
                }
                return response.body().bytes();
            }
        } catch (Exception e) {
            log.error("Error al obtener CV desde Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("No se pudo obtener el archivo CV: " + e.getMessage());
        }
    }
}