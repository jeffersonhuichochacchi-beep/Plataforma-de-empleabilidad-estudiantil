package com.elp.postulaciones_service.service;

import com.elp.postulaciones_service.dto.evaluacion.EvaluacionRequest;
import com.elp.postulaciones_service.dto.evaluacion.EvaluacionResponse;
import com.elp.postulaciones_service.exception.BusinessException;
import com.elp.postulaciones_service.exception.ForbiddenException;
import com.elp.postulaciones_service.exception.ResourceNotFoundException;
import com.elp.postulaciones_service.mapper.EvaluacionMapper;
import com.elp.postulaciones_service.model.AuditoriaPostulacion;
import com.elp.postulaciones_service.model.EvaluacionPostulacion;
import com.elp.postulaciones_service.model.HistorialPostulacion;
import com.elp.postulaciones_service.model.Postulacion;
import com.elp.postulaciones_service.model.enums.EstadoPostulacion;
import com.elp.postulaciones_service.repository.AuditoriaPostulacionRepository;
import com.elp.postulaciones_service.repository.EvaluacionPostulacionRepository;
import com.elp.postulaciones_service.repository.HistorialPostulacionRepository;
import com.elp.postulaciones_service.repository.PostulacionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EvaluacionServiceImpl implements EvaluacionService {

    private static final Logger log = LoggerFactory.getLogger(EvaluacionServiceImpl.class);

    private final EvaluacionPostulacionRepository evaluacionRepository;
    private final PostulacionRepository postulacionRepository;
    private final HistorialPostulacionRepository historialRepository;
    private final AuditoriaPostulacionRepository auditoriaRepository;
    private final EvaluacionMapper evaluacionMapper;

    @Override
    @Transactional
    public EvaluacionResponse crearEvaluacion(UUID postulacionId, UUID evaluadorId, EvaluacionRequest request) {
        Postulacion postulacion = postulacionRepository.findByUuid(postulacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Postulacion no encontrada"));

        validarPostulacionParaEvaluacion(postulacion);

        EvaluacionPostulacion evaluacion = EvaluacionPostulacion.builder()
                .postulacion(postulacion)
                .evaluadorId(evaluadorId)
                .puntaje(request.getPuntaje())
                .comentario(request.getComentario())
                .fortalezas(request.getFortalezas())
                .debilidades(request.getDebilidades())
                .recomendacion(request.getRecomendacion())
                .build();

        evaluacion = evaluacionRepository.save(evaluacion);

        if (postulacion.getEstado() == EstadoPostulacion.ENTREVISTA) {
            EstadoPostulacion estadoAnt = postulacion.getEstado();
            postulacion.setEstado(EstadoPostulacion.EVALUACION);
            postulacionRepository.save(postulacion);
            
            registrarHistorial(postulacion, estadoAnt, EstadoPostulacion.EVALUACION, evaluadorId, "Evaluacion registrada");
        }

        registrarAuditoria(evaluadorId, "EVALUACION_CREADA", "Evaluacion " + evaluacion.getUuid() + " creada para postulacion " + postulacionId);
        log.info("Evaluacion {} creada por el reclutador/empresa {}", evaluacion.getUuid(), evaluadorId);

        return evaluacionMapper.toResponse(evaluacion);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EvaluacionResponse> listarEvaluacionesPorPostulacion(UUID postulacionId, UUID usuarioId, String rol, Pageable pageable) {
        Postulacion postulacion = postulacionRepository.findByUuid(postulacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Postulacion no encontrada"));

        validarAccesoEvaluacion(postulacion, usuarioId, rol);

        return evaluacionRepository.findByPostulacion(postulacion, pageable).map(evaluacionMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluacionResponse obtenerEvaluacion(UUID evaluacionId, UUID usuarioId, String rol) {
        EvaluacionPostulacion evaluacion = evaluacionRepository.findByUuid(evaluacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluacion no encontrada"));

        validarAccesoEvaluacion(evaluacion.getPostulacion(), usuarioId, rol);

        return evaluacionMapper.toResponse(evaluacion);
    }

    @Override
    @Transactional
    public EvaluacionResponse actualizarEvaluacion(UUID evaluacionId, EvaluacionRequest request, UUID usuarioId) {
        EvaluacionPostulacion evaluacion = evaluacionRepository.findByUuid(evaluacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluacion no encontrada"));

        Postulacion postulacion = evaluacion.getPostulacion();
        if (!postulacion.getEmpresaId().equals(usuarioId)) {
            // Nota: Para ser mas laxos, podriamos revisar rol. Aqui forzamos propiedad sobre la empresa
            throw new ForbiddenException("No tienes permiso para actualizar esta evaluacion");
        }

        evaluacion.setPuntaje(request.getPuntaje());
        evaluacion.setComentario(request.getComentario());
        evaluacion.setFortalezas(request.getFortalezas());
        evaluacion.setDebilidades(request.getDebilidades());
        evaluacion.setRecomendacion(request.getRecomendacion());

        evaluacion = evaluacionRepository.save(evaluacion);
        registrarAuditoria(usuarioId, "EVALUACION_ACTUALIZADA", "Evaluacion " + evaluacionId + " actualizada");

        return evaluacionMapper.toResponse(evaluacion);
    }

    private void validarPostulacionParaEvaluacion(Postulacion p) {
        EstadoPostulacion e = p.getEstado();
        // Solo bloquear estados que ya no tienen sentido evaluar
        if (e == EstadoPostulacion.RETIRADA || e == EstadoPostulacion.CANCELADA || e == EstadoPostulacion.CERRADA) {
            throw new BusinessException("No se pueden evaluar postulaciones que estan en estado " + e.name());
        }
        // Permitir evaluar incluso RECHAZADA (para documentar razones) y todos los demás estados activos
    }

    private void validarAccesoEvaluacion(Postulacion p, UUID usuarioId, String rol) {
        if ("ESTUDIANTE".equals(rol) || "PROFESIONAL".equals(rol) || "CANDIDATO".equals(rol)) {
            throw new ForbiddenException("Los candidatos no tienen permiso para ver evaluaciones internas");
        } else if ("EMPRESA".equals(rol) || "RECLUTADOR".equals(rol)) {
            if (!p.getEmpresaId().equals(usuarioId)) {
                throw new ForbiddenException("No tienes permiso sobre esta postulacion");
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