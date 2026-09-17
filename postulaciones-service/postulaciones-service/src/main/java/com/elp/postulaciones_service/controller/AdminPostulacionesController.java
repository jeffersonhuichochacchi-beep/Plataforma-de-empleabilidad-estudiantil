package com.elp.postulaciones_service.controller;

import com.elp.postulaciones_service.model.Postulacion;
import com.elp.postulaciones_service.model.Entrevista;
import com.elp.postulaciones_service.model.enums.EstadoPostulacion;
import com.elp.postulaciones_service.repository.PostulacionRepository;
import com.elp.postulaciones_service.repository.EntrevistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/postulaciones")
@RequiredArgsConstructor
public class AdminPostulacionesController {
    private final PostulacionRepository repository;
    private final EntrevistaRepository entrevistaRepository;

    @GetMapping
    public Page<AdminPostulacionResponse> listar(Pageable pageable) {
        return repository.findAll(pageable).map(p -> AdminPostulacionResponse.from(p, entrevistaRepository.findFirstByPostulacionOrderByFechaHoraAsc(p).orElse(null)));
    }

    @PutMapping("/{uuid}/estado")
    public AdminPostulacionResponse cambiarEstado(@PathVariable UUID uuid, @RequestParam EstadoPostulacion estado) {
        Postulacion p = repository.findByUuid(uuid).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Postulación no encontrada"));
        p.setEstado(estado);
        return AdminPostulacionResponse.from(repository.save(p), entrevistaRepository.findFirstByPostulacionOrderByFechaHoraAsc(p).orElse(null));
    }

    public record AdminPostulacionResponse(UUID uuid, UUID candidatoId, UUID ofertaId, UUID empresaId,
        Timestamp fechaPostulacion, Timestamp fechaActualizacion, EstadoPostulacion estado,
        Integer porcentajeCoincidencia, boolean cvAdjunto, Timestamp entrevistaFecha) {
        static AdminPostulacionResponse from(Postulacion p, Entrevista entrevista) {
            return new AdminPostulacionResponse(p.getUuid(), p.getCandidatoId(), p.getOfertaId(), p.getEmpresaId(),
                p.getFechaPostulacion(), p.getFechaActualizacion(), p.getEstado(), p.getPorcentajeCoincidencia(), p.getCvUrl() != null && !p.getCvUrl().isBlank(), entrevista == null ? null : entrevista.getFechaHora());
        }
    }
}
