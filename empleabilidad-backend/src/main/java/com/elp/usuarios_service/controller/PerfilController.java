package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.dto.PerfilResponseDTO;
import com.elp.usuarios_service.dto.PerfilUpdateRequest;
import com.elp.usuarios_service.dto.ExperienciaRequest;
import com.elp.usuarios_service.dto.EducacionRequest;
import com.elp.usuarios_service.dto.HabilidadRequest;
import com.elp.usuarios_service.service.PerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ContentDisposition;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/api/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping("/me")
    public ResponseEntity<PerfilResponseDTO> obtenerMiPerfil(Authentication authentication) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(perfilService.obtenerMiPerfil(usuarioId));
    }

    @PostMapping("/cv")
    public ResponseEntity<Void> subirCv(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) {
            return ResponseEntity.status(401).build();
        }
        perfilService.subirCv(usuarioId, file);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/cv-portafolio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PerfilResponseDTO> subirCvPortafolio(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(perfilService.subirCvPortafolio(usuarioId, file));
    }

    @GetMapping("/cv-portafolio/archivo")
    public ResponseEntity<byte[]> descargarCvPortafolio(Authentication authentication) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.inline().filename("CV_Candidato.pdf").build());
        return ResponseEntity.ok().headers(headers)
                .body(perfilService.descargarCvPortafolio(usuarioId));
    }

    @PutMapping("/me")
    public ResponseEntity<PerfilResponseDTO> actualizarPerfil(Authentication authentication, @Valid @RequestBody PerfilUpdateRequest request) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(perfilService.actualizarPerfil(usuarioId, request));
    }

    @PostMapping("/experiencias")
    public ResponseEntity<PerfilResponseDTO.ExperienciaDTO> agregarExperiencia(Authentication authentication, @Valid @RequestBody ExperienciaRequest request) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(perfilService.agregarExperiencia(usuarioId, request));
    }

    @DeleteMapping("/experiencias/{id}")
    public ResponseEntity<Void> eliminarExperiencia(Authentication authentication, @PathVariable UUID id) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        perfilService.eliminarExperiencia(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/educacion")
    public ResponseEntity<PerfilResponseDTO.EducacionDTO> agregarEducacion(Authentication authentication, @Valid @RequestBody EducacionRequest request) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(perfilService.agregarEducacion(usuarioId, request));
    }

    @DeleteMapping("/educacion/{id}")
    public ResponseEntity<Void> eliminarEducacion(Authentication authentication, @PathVariable UUID id) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        perfilService.eliminarEducacion(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/habilidades")
    public ResponseEntity<PerfilResponseDTO.HabilidadDTO> agregarHabilidad(Authentication authentication, @Valid @RequestBody HabilidadRequest request) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(perfilService.agregarHabilidad(usuarioId, request));
    }

    @DeleteMapping("/habilidades/{id}")
    public ResponseEntity<Void> eliminarHabilidad(Authentication authentication, @PathVariable UUID id) {
        UUID usuarioId = usuarioId(authentication);
        if (usuarioId == null) return ResponseEntity.status(401).build();
        perfilService.eliminarHabilidad(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    private UUID usuarioId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        try {
            return perfilService.resolverUsuarioId(authentication.getName());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
