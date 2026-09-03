package com.elp.postulaciones_service.controller;

import com.elp.postulaciones_service.dto.postulacion.PostulacionRequest;
import com.elp.postulaciones_service.dto.postulacion.PostulacionResponse;
import com.elp.postulaciones_service.model.enums.EstadoPostulacion;
import com.elp.postulaciones_service.service.PostulacionService;
import com.elp.postulaciones_service.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/postulaciones")
@RequiredArgsConstructor
@Tag(name = "Postulaciones", description = "Gestiona todo el ciclo de vida de las postulaciones")
@SecurityRequirement(name = "bearerAuth")
public class PostulacionController {

    private final PostulacionService postulacionService;

    @PostMapping
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESIONAL') or hasRole('CANDIDATO')")
    @Operation(summary = "Crear postulacion", description = "Crea una nueva postulacion (solo candidatos)")
    public ResponseEntity<PostulacionResponse> crearPostulacion(@Valid @RequestBody PostulacionRequest request) {
        UUID candidatoId = SecurityUtils.getUsuarioLogueadoId();
        PostulacionResponse response = postulacionService.crearPostulacion(candidatoId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{uuid}")
    @Operation(summary = "Obtener postulacion por UUID", description = "Verifica proteccion IDOR automaticamente")
    public ResponseEntity<PostulacionResponse> obtenerPostulacion(@PathVariable UUID uuid) {
        UUID usuarioId = SecurityUtils.getUsuarioLogueadoId();
        String rol = SecurityUtils.getRolUsuarioLogueado();
        PostulacionResponse response = postulacionService.obtenerPostulacion(uuid, usuarioId, rol);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{uuid}/estado")
    @PreAuthorize("hasRole('EMPRESA') or hasRole('RECLUTADOR') or hasRole('ADMIN')")
    @Operation(summary = "Cambiar estado de postulacion", description = "Avanza o rechaza una postulacion (solo reclutadores)")
    public ResponseEntity<PostulacionResponse> cambiarEstado(
            @PathVariable UUID uuid,
            @RequestParam EstadoPostulacion nuevoEstado,
            @RequestParam(required = false) String comentario) {
        
        UUID usuarioId = SecurityUtils.getUsuarioLogueadoId();
        String rol = SecurityUtils.getRolUsuarioLogueado();
        postulacionService.obtenerPostulacion(uuid, usuarioId, rol); // Validacion IDOR
        
        PostulacionResponse response = postulacionService.cambiarEstado(uuid, nuevoEstado, usuarioId, comentario);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{uuid}/retirar")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESIONAL') or hasRole('CANDIDATO')")
    @Operation(summary = "Retirar postulacion", description = "El candidato retira su propia postulacion activa")
    public ResponseEntity<PostulacionResponse> retirarPostulacion(
            @PathVariable UUID uuid,
            @RequestParam(required = false) String motivo) {
        UUID candidatoId = SecurityUtils.getUsuarioLogueadoId();
        PostulacionResponse response = postulacionService.retirarPostulacion(uuid, candidatoId, motivo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mis-postulaciones")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESIONAL') or hasRole('CANDIDATO')")
    @Operation(summary = "Listar mis postulaciones", description = "Lista paginada de postulaciones del usuario autenticado")
    public ResponseEntity<Page<PostulacionResponse>> listarMisPostulaciones(
            @RequestParam(required = false) EstadoPostulacion estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        int validSize = size > 100 ? 100 : size;
        Pageable pageable = PageRequest.of(page, validSize);
        UUID candidatoId = SecurityUtils.getUsuarioLogueadoId();
        Page<PostulacionResponse> response = postulacionService.listarMisPostulaciones(candidatoId, estado, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ofertas/{ofertaId}")
    @PreAuthorize("hasRole('EMPRESA') or hasRole('RECLUTADOR') or hasRole('ADMIN')")
    @Operation(summary = "Listar postulaciones de una oferta", description = "Lista paginada de postulantes para una oferta especifica")
    public ResponseEntity<Page<PostulacionResponse>> listarPorOferta(
            @PathVariable UUID ofertaId,
            @RequestParam(required = false) EstadoPostulacion estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        int validSize = size > 100 ? 100 : size;
        Pageable pageable = PageRequest.of(page, validSize);
        UUID empresaIdLogueada = SecurityUtils.getUsuarioLogueadoId();
        Page<PostulacionResponse> response = postulacionService.listarPostulacionesPorOferta(ofertaId, empresaIdLogueada, estado, pageable);
        return ResponseEntity.ok(response);
    }
}