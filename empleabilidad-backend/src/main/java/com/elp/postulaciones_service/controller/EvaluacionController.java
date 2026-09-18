package com.elp.postulaciones_service.controller;

import com.elp.postulaciones_service.dto.evaluacion.EvaluacionRequest;
import com.elp.postulaciones_service.dto.evaluacion.EvaluacionResponse;
import com.elp.postulaciones_service.service.EvaluacionService;
import com.elp.postulaciones_service.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Evaluaciones", description = "API para gestion de evaluaciones internas")
@SecurityRequirement(name = "bearerAuth")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    @PostMapping("/postulaciones/{postulacionId}/evaluaciones")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'EMPRESA', 'ADMINISTRADOR')")
    @Operation(summary = "Crear evaluacion", description = "Crea una evaluacion interna para una postulacion.")
    public ResponseEntity<EvaluacionResponse> crearEvaluacion(
            @PathVariable UUID postulacionId,
            @Valid @RequestBody EvaluacionRequest request) {
        UUID usuarioId = SecurityUtils.getUsuarioLogueadoId();
        EvaluacionResponse response = evaluacionService.crearEvaluacion(postulacionId, usuarioId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/postulaciones/{postulacionId}/evaluaciones")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'EMPRESA', 'ADMINISTRADOR')")
    @Operation(summary = "Listar evaluaciones")
    public ResponseEntity<Page<EvaluacionResponse>> listarEvaluaciones(
            @PathVariable UUID postulacionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        int validSize = size > 100 ? 100 : size;
        Pageable pageable = PageRequest.of(page, validSize);
        UUID usuarioId = SecurityUtils.getUsuarioLogueadoId();
        String rol = SecurityUtils.getRolUsuarioLogueado();
        
        return ResponseEntity.ok(evaluacionService.listarEvaluacionesPorPostulacion(postulacionId, usuarioId, rol, pageable));
    }

    @GetMapping("/evaluaciones/{evaluacionId}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'EMPRESA', 'ADMINISTRADOR')")
    @Operation(summary = "Obtener evaluacion por ID")
    public ResponseEntity<EvaluacionResponse> obtenerEvaluacion(@PathVariable UUID evaluacionId) {
        UUID usuarioId = SecurityUtils.getUsuarioLogueadoId();
        String rol = SecurityUtils.getRolUsuarioLogueado();
        return ResponseEntity.ok(evaluacionService.obtenerEvaluacion(evaluacionId, usuarioId, rol));
    }

    @PutMapping("/evaluaciones/{evaluacionId}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'EMPRESA', 'ADMINISTRADOR')")
    @Operation(summary = "Actualizar evaluacion")
    public ResponseEntity<EvaluacionResponse> actualizarEvaluacion(
            @PathVariable UUID evaluacionId,
            @Valid @RequestBody EvaluacionRequest request) {
        UUID usuarioId = SecurityUtils.getUsuarioLogueadoId();
        return ResponseEntity.ok(evaluacionService.actualizarEvaluacion(evaluacionId, request, usuarioId));
    }
}