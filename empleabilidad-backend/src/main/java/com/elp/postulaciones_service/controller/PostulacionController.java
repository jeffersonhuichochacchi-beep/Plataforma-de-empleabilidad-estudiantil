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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/postulaciones")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Postulaciones", description = "Gestiona todo el ciclo de vida de las postulaciones")
@SecurityRequirement(name = "bearerAuth")
public class PostulacionController {

    private final PostulacionService postulacionService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESIONAL') or hasRole('CANDIDATO') or hasRole('EMPRESA') or hasRole('ADMINISTRADOR') or hasRole('ADMIN')")
    @Operation(summary = "Crear postulacion con CV", description = "Crea una nueva postulacion con archivo CV (PDF, DOC, DOCX)")
    public ResponseEntity<PostulacionResponse> crearPostulacion(
            @Valid @ModelAttribute PostulacionRequest request,
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) {
        
        UUID candidatoId = SecurityUtils.getUsuarioLogueadoId();
        
        log.info("Recibiendo postulación de candidato {} para oferta {}", 
                candidatoId, request.getOfertaId());
        
        if (cvFile != null && !cvFile.isEmpty()) {
            log.info("Archivo CV recibido: {}, Tamaño: {} bytes, Tipo: {}", 
                    cvFile.getOriginalFilename(), cvFile.getSize(), cvFile.getContentType());
        } else {
            log.warn("No se recibió archivo CV en la postulación");
        }
        
        PostulacionResponse response = postulacionService.crearPostulacion(candidatoId, request, cvFile);
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
    @PreAuthorize("hasRole('EMPRESA') or hasRole('RECLUTADOR') or hasRole('ADMIN') or hasRole('ADMINISTRADOR') or hasRole('ESTUDIANTE')")
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
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESIONAL') or hasRole('CANDIDATO') or hasRole('EMPRESA') or hasRole('ADMINISTRADOR')")
    @Operation(summary = "Retirar postulacion", description = "El candidato retira su propia postulacion activa")
    public ResponseEntity<PostulacionResponse> retirarPostulacion(
            @PathVariable UUID uuid,
            @RequestParam(required = false) String motivo) {
        UUID candidatoId = SecurityUtils.getUsuarioLogueadoId();
        PostulacionResponse response = postulacionService.retirarPostulacion(uuid, candidatoId, motivo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mis-postulaciones")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('PROFESIONAL') or hasRole('CANDIDATO') or hasRole('EMPRESA') or hasRole('ADMINISTRADOR')")
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
    @PreAuthorize("hasRole('EMPRESA') or hasRole('RECLUTADOR') or hasRole('ADMIN') or hasRole('ADMINISTRADOR') or hasRole('ESTUDIANTE')")
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

    @GetMapping("/empresa")
    @PreAuthorize("hasRole('EMPRESA') or hasRole('RECLUTADOR') or hasRole('ADMIN') or hasRole('ADMINISTRADOR') or hasRole('ESTUDIANTE')")
    @Operation(summary = "Listar todas las postulaciones de la empresa", description = "Lista paginada de todos los postulantes para las ofertas de la empresa")
    public ResponseEntity<Page<PostulacionResponse>> listarPorEmpresa(
            @RequestParam(required = false) UUID empresaId,
            @RequestParam(required = false) UUID ofertaId,
            @RequestParam(required = false) EstadoPostulacion estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        int validSize = size > 100 ? 100 : size;
        Pageable pageable = PageRequest.of(page, validSize);
        UUID targetEmpresaId = empresaId != null ? empresaId : SecurityUtils.getUsuarioLogueadoId();
        String rol = SecurityUtils.getRolUsuarioLogueado();
        if (empresaId == null && ("ADMIN".equals(rol) || "ADMINISTRADOR".equals(rol))) {
            targetEmpresaId = null;
        }
        Page<PostulacionResponse> response = postulacionService.listarPostulacionesPorEmpresa(targetEmpresaId, ofertaId, estado, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{uuid}/cv")
    @Operation(summary = "Visualizar o descargar CV en PDF", description = "Descarga los bytes del CV desde Cloudinary y los entrega como application/pdf con nombre formateado")
    public ResponseEntity<byte[]> verCv(@PathVariable UUID uuid) {
        byte[] pdfBytes = postulacionService.descargarCv(uuid);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
            ContentDisposition.inline()
                .filename("CV_Candidato_" + uuid.toString().substring(0, 8) + ".pdf")
                .build()
        );
        
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @DeleteMapping("/{uuid}")
    @PreAuthorize("hasRole('EMPRESA') or hasRole('RECLUTADOR') or hasRole('ADMIN') or hasRole('ADMINISTRADOR')")
    @Operation(summary = "Eliminar postulación", description = "La empresa elimina permanentemente una postulación de candidato")
    public ResponseEntity<Void> eliminarPostulacion(@PathVariable UUID uuid) {
        UUID empresaId = SecurityUtils.getUsuarioLogueadoId();
        postulacionService.eliminarPostulacion(uuid, empresaId);
        return ResponseEntity.noContent().build();
    }
}