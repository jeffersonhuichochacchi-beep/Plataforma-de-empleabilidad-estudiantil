package com.elp.usuarios_service.service;

import com.elp.usuarios_service.dto.PerfilResponseDTO;
import com.elp.usuarios_service.model.*;
import com.elp.usuarios_service.model.enums.Rol;
import com.elp.usuarios_service.dto.EducacionRequest;
import com.elp.usuarios_service.dto.ExperienciaRequest;
import com.elp.usuarios_service.dto.HabilidadRequest;
import com.elp.usuarios_service.dto.PerfilUpdateRequest;
import com.elp.usuarios_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.sql.Date;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final UsuarioBaseRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final EmpresaRepository empresaRepository;
    private final EducacionRepository educacionRepository;
    private final DocumentoCVRepository documentoCVRepository;
    private final ExperienciaLaboralRepository experienciaRepository;
    private final HabilidadRepository habilidadRepository;
    private final PerfilHabilidadRepository perfilHabilidadRepository;
    private final StorageService storageService;
    private final ProfileCompletionService profileCompletionService;
    private final CloudinaryProfileService cloudinaryProfileService;
    private final SupabaseAuthClient supabaseAuthClient;

    /**
     * Resuelve el usuario autenticado tanto cuando Spring Security entrega el
     * UUID del JWT como cuando entrega el correo del usuario local.
     */
    public UUID resolverUsuarioId(String identificador) {
        if (identificador == null || identificador.isBlank()) {
            throw new IllegalArgumentException("Usuario autenticado no identificado");
        }
        try {
            UUID candidato = UUID.fromString(identificador);
            // El JWT puede contener el ID interno o el auth_user_id de Supabase.
            if (usuarioRepository.existsById(candidato)) {
                return candidato;
            }
            return usuarioRepository.findByAuthUserId(candidato)
                    .map(UsuarioBase::getId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        } catch (IllegalArgumentException ignored) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
    }

    @Transactional
    public PerfilResponseDTO obtenerMiPerfil(UUID usuarioId) {
        UsuarioBase usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        String nombreParaMostrar = usuario.getEmail();
        ProfileCompletionService.ProfileCompletionResult result = null;

        if (usuario instanceof Estudiante) {
            Estudiante estudiante = estudianteRepository.findById(usuarioId)
                    .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado"));
            nombreParaMostrar = (estudiante.getNombres() != null ? estudiante.getNombres() : "") + " " + 
                                (estudiante.getApellidos() != null ? estudiante.getApellidos() : "");
            
            List<Educacion> educaciones = educacionRepository.findByUsuarioId(usuarioId);
            boolean tieneCvActivo = documentoCVRepository.findByUsuarioIdAndActivoTrue(usuarioId).isPresent();
            
            result = profileCompletionService.evaluarEstudiante(estudiante, educaciones, tieneCvActivo);
        } else if (usuario.getRol() == Rol.EMPRESA) {
            Empresa empresa = empresaRepository.findById(usuarioId)
                    .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));
            nombreParaMostrar = empresa.getRazonSocial() != null ? empresa.getRazonSocial() : empresa.getEmail();
            
            result = profileCompletionService.evaluarEmpresa(empresa);
        } else {
            result = ProfileCompletionService.ProfileCompletionResult.builder()
                    .porcentaje(100)
                    .estado(com.elp.usuarios_service.model.enums.EstadoPerfil.COMPLETO)
                    .motivosPendientes(List.of())
                    .puedeAccionar(true)
                    .build();
        }

        if (result != null) {
            usuario.setPorcentajeCompletitud(result.getPorcentaje());
            usuario.setEstadoPerfil(result.getEstado());
            usuarioRepository.save(usuario);
        }

        List<PerfilResponseDTO.ExperienciaDTO> experiencias = experienciaRepository.findByUsuarioId(usuarioId).stream().map(e -> PerfilResponseDTO.ExperienciaDTO.builder()
                .id(e.getId()).empresa(e.getEmpresa()).cargo(e.getCargo()).descripcion(e.getDescripcion())
                .fechaInicio(e.getFechaInicio() != null ? e.getFechaInicio().toString() : null)
                .fechaFin(e.getFechaFin() != null ? e.getFechaFin().toString() : null).actual(e.getActual())
                .ubicacion(e.getUbicacion()).modalidad(e.getModalidad()).build()).toList();
        List<PerfilResponseDTO.EducacionDTO> educacion = educacionRepository.findByUsuarioId(usuarioId).stream().map(e -> PerfilResponseDTO.EducacionDTO.builder()
                .id(e.getId()).institucion(e.getInstitucion()).carrera(e.getCarrera()).grado(e.getGrado())
                .fechaInicio(e.getFechaInicio() != null ? e.getFechaInicio().toString() : null)
                .fechaFin(e.getFechaFin() != null ? e.getFechaFin().toString() : null).actual(e.getActual())
                .descripcion(e.getDescripcion()).build()).toList();
        List<PerfilResponseDTO.HabilidadDTO> habilidades = perfilHabilidadRepository.findByUsuarioId(usuarioId).stream().map(h -> PerfilResponseDTO.HabilidadDTO.builder()
                .id(h.getId()).nombre(h.getHabilidad().getNombre()).nivel(h.getNivel()).anosExperiencia(h.getAnosExperiencia()).build()).toList();
        String cvNombre = documentoCVRepository.findByUsuarioIdAndActivoTrue(usuarioId).map(DocumentoCV::getNombreOriginal).orElse(null);

        PerfilResponseDTO.PerfilResponseDTOBuilder response = PerfilResponseDTO.builder()
                .id(usuario.getId())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .nombreParaMostrar(nombreParaMostrar.trim())
                .porcentajeCompletitud(usuario.getPorcentajeCompletitud())
                .estadoPerfil(usuario.getEstadoPerfil())
                .motivosPendientes(result != null ? result.getMotivosPendientes() : List.of())
                .puedeAccionar(result != null ? result.getPuedeAccionar() : true)
                .telefono(usuario.getTelefono()).fotoPerfil(usuario.getFotoPerfil())
                .experiencias(experiencias).educacion(educacion).habilidades(habilidades).cvNombre(cvNombre);
        if (usuario instanceof Estudiante e) {
            response.nombres(e.getNombres()).apellidos(e.getApellidos()).biografia(e.getBiografia())
                    .tituloProfesional(e.getTituloProfesional()).ubicacion(e.getUbicacion()).enlacePortafolio(e.getEnlacePortafolio());
        }
        return response.build();
    }

    @Transactional
    public PerfilResponseDTO actualizarPerfil(UUID usuarioId, PerfilUpdateRequest request) {
        Estudiante estudiante = estudianteRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Solo los candidatos pueden actualizar este perfil"));
        if (request.getNombres() != null) estudiante.setNombres(request.getNombres().trim());
        if (request.getApellidos() != null) estudiante.setApellidos(request.getApellidos().trim());
        if (request.getTelefono() != null) {
            String phone = request.getTelefono().trim();
            UsuarioBase usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
            supabaseAuthClient.updatePhone(usuario.getAuthUserId(), phone);
        }
        estudiante.setBiografia(request.getBiografia());
        estudiante.setTituloProfesional(request.getTituloProfesional());
        estudiante.setUbicacion(request.getUbicacion());
        if (request.getEnlacePortafolio() != null) estudiante.setEnlacePortafolio(request.getEnlacePortafolio());
        estudianteRepository.save(estudiante);
        return obtenerMiPerfil(usuarioId);
    }

    @Transactional
    public PerfilResponseDTO.ExperienciaDTO agregarExperiencia(UUID usuarioId, ExperienciaRequest request) {
        ExperienciaLaboral e = ExperienciaLaboral.builder().usuarioId(usuarioId).empresa(request.getEmpresa()).cargo(request.getCargo())
                .descripcion(request.getDescripcion()).fechaInicio(request.getFechaInicio() == null ? null : Date.valueOf(request.getFechaInicio()))
                .fechaFin(request.getFechaFin() == null ? null : Date.valueOf(request.getFechaFin())).actual(Boolean.TRUE.equals(request.getActual()))
                .ubicacion(request.getUbicacion()).modalidad(request.getModalidad()).build();
        e = experienciaRepository.save(e);
        return PerfilResponseDTO.ExperienciaDTO.builder().id(e.getId()).empresa(e.getEmpresa()).cargo(e.getCargo()).descripcion(e.getDescripcion())
                .fechaInicio(e.getFechaInicio() == null ? null : e.getFechaInicio().toString()).fechaFin(e.getFechaFin() == null ? null : e.getFechaFin().toString())
                .actual(e.getActual()).ubicacion(e.getUbicacion()).modalidad(e.getModalidad()).build();
    }

    @Transactional
    public void eliminarExperiencia(UUID usuarioId, UUID id) {
        experienciaRepository.findById(id).filter(e -> e.getUsuarioId().equals(usuarioId)).ifPresent(experienciaRepository::delete);
    }

    @Transactional
    public PerfilResponseDTO.EducacionDTO agregarEducacion(UUID usuarioId, EducacionRequest request) {
        Educacion e = Educacion.builder().usuarioId(usuarioId).institucion(request.getInstitucion()).carrera(request.getCarrera()).grado(request.getGrado())
                .fechaInicio(request.getFechaInicio() == null ? null : Date.valueOf(request.getFechaInicio())).fechaFin(request.getFechaFin() == null ? null : Date.valueOf(request.getFechaFin()))
                .actual(Boolean.TRUE.equals(request.getActual())).descripcion(request.getDescripcion()).build();
        e = educacionRepository.save(e);
        return PerfilResponseDTO.EducacionDTO.builder().id(e.getId()).institucion(e.getInstitucion()).carrera(e.getCarrera()).grado(e.getGrado())
                .fechaInicio(e.getFechaInicio() == null ? null : e.getFechaInicio().toString()).fechaFin(e.getFechaFin() == null ? null : e.getFechaFin().toString())
                .actual(e.getActual()).descripcion(e.getDescripcion()).build();
    }

    @Transactional
    public void eliminarEducacion(UUID usuarioId, UUID id) {
        educacionRepository.findById(id).filter(e -> e.getUsuarioId().equals(usuarioId)).ifPresent(educacionRepository::delete);
    }

    @Transactional
    public PerfilResponseDTO.HabilidadDTO agregarHabilidad(UUID usuarioId, HabilidadRequest request) {
        Habilidad habilidad = habilidadRepository.findByNombreIgnoreCase(request.getNombre()).orElseGet(() -> habilidadRepository.save(Habilidad.builder().nombre(request.getNombre().trim()).activo(true).build()));
        PerfilHabilidad ph = perfilHabilidadRepository.findByUsuarioIdAndHabilidadId(usuarioId, habilidad.getId()).orElseGet(() -> PerfilHabilidad.builder().usuarioId(usuarioId).habilidad(habilidad).build());
        ph.setNivel(request.getNivel() == null ? "INTERMEDIO" : request.getNivel());
        ph.setAnosExperiencia(request.getAnosExperiencia());
        ph = perfilHabilidadRepository.save(ph);
        return PerfilResponseDTO.HabilidadDTO.builder().id(ph.getId()).nombre(habilidad.getNombre()).nivel(ph.getNivel()).anosExperiencia(ph.getAnosExperiencia()).build();
    }

    @Transactional
    public void eliminarHabilidad(UUID usuarioId, UUID id) {
        perfilHabilidadRepository.findById(id).filter(h -> h.getUsuarioId().equals(usuarioId)).ifPresent(perfilHabilidadRepository::delete);
    }

    @Transactional
    public void subirCv(UUID usuarioId, MultipartFile file) {
        UsuarioBase usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
                
        if (!(usuario instanceof Estudiante)) {
            throw new IllegalArgumentException("Solo los perfiles candidatos pueden subir un CV");
        }

        String storageKey = storageService.storeFile(file, usuarioId);

        documentoCVRepository.findByUsuarioIdAndActivoTrue(usuarioId).ifPresent(doc -> {
            doc.setActivo(false);
            doc.setFechaDesactivacion(new Timestamp(System.currentTimeMillis()));
            documentoCVRepository.save(doc);
        });

        DocumentoCV nuevoCv = DocumentoCV.builder()
                .usuarioId(usuarioId)
                .nombreOriginal(file.getOriginalFilename())
                .storageKey(storageKey)
                .contentType(file.getContentType())
                .tamanoBytes(file.getSize())
                .activo(true)
                .build();
                
        documentoCVRepository.save(nuevoCv);
        
        obtenerMiPerfil(usuarioId);
    }

    @Transactional
    public PerfilResponseDTO subirCvPortafolio(UUID usuarioId, MultipartFile file) {
        Estudiante estudiante = estudianteRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Solo los candidatos pueden subir un CV"));
        try {
            estudiante.setEnlacePortafolio(cloudinaryProfileService.subirCv(file, usuarioId));
        } catch (IOException e) {
            throw new IllegalArgumentException("No se pudo subir el CV a Cloudinary", e);
        }
        estudianteRepository.save(estudiante);
        return obtenerMiPerfil(usuarioId);
    }

    @Transactional(readOnly = true)
    public byte[] descargarCvPortafolio(UUID usuarioId) {
        Estudiante estudiante = estudianteRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Candidato no encontrado"));
        if (estudiante.getEnlacePortafolio() == null || estudiante.getEnlacePortafolio().isBlank()) {
            throw new IllegalArgumentException("El candidato no tiene un CV cargado");
        }
        try {
            return cloudinaryProfileService.descargar(estudiante.getEnlacePortafolio());
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalArgumentException("No se pudo obtener el CV desde Cloudinary", e);
        }
    }
}
