package com.elp.postulaciones_service.service;

import com.elp.postulaciones_service.client.OfertasClient;
import com.elp.postulaciones_service.client.UsuariosClient;
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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostulacionServiceImpl implements PostulacionService {

    private final PostulacionRepository postulacionRepository;
    private final HistorialPostulacionRepository historialRepository;
    private final AuditoriaPostulacionRepository auditoriaRepository;
    private final EstadoPostulacionService estadoPostulacionService;
    private final PostulacionMapper postulacionMapper;
    
    private final OfertasClient ofertasClient;
    private final UsuariosClient usuariosClient;

    @Override
    @Transactional
    public PostulacionResponse crearPostulacion(UUID candidatoId, PostulacionRequest request) {
        if (postulacionRepository.existsByCandidatoIdAndOfertaId(candidatoId, request.getOfertaId())) {
            throw new DuplicatePostulationException("El candidato ya tiene una postulacion activa para esta oferta.");
        }

        String jwt = SecurityUtils.getJwtToken();

        // 1. Validar existencia del candidato (no asume que existe aunque tenga JWT, podria estar suspendido o borrado)
        usuariosClient.obtenerResumenCandidato(candidatoId, jwt);

        // 2. Validar oferta
        OfertaResumenDTO oferta = ofertasClient.validarOferta(request.getOfertaId(), jwt);
        if (!Boolean.TRUE.equals(oferta.getAceptaPostulaciones()) || !"ACTIVA".equals(oferta.getEstado())) {
            throw new BusinessException("La oferta no acepta postulaciones actualmente.");
        }
        if (!oferta.getEmpresaId().equals(request.getEmpresaId())) {
            throw new BusinessException("Discrepancia en la empresa: la oferta no pertenece a la empresa indicada.");
        }

        Postulacion postulacion = new Postulacion();
        postulacion.setCandidatoId(candidatoId);
        postulacion.setOfertaId(request.getOfertaId());
        postulacion.setEmpresaId(request.getEmpresaId());
        postulacion.setCartaPresentacion(request.getCartaPresentacion());
        postulacion.setCvUrl(request.getCvUrl());
        postulacion.setEstado(EstadoPostulacion.ENVIADA);

        try {
            postulacion = postulacionRepository.saveAndFlush(postulacion);
        } catch (DataIntegrityViolationException e) {
            throw new DuplicatePostulationException("El candidato ya tiene una postulacion activa para esta oferta.");
        }

        registrarHistorial(postulacion, null, EstadoPostulacion.ENVIADA, candidatoId, "Postulacion creada inicialmente");
        registrarAuditoria(candidatoId, "POSTULACION_CREADA", "Postulacion creada para oferta " + request.getOfertaId());

        return postulacionMapper.toResponse(postulacion);
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
        return postulaciones.map(postulacionMapper::toResponse);
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
        return postulaciones.map(postulacionMapper::toResponse);
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
}