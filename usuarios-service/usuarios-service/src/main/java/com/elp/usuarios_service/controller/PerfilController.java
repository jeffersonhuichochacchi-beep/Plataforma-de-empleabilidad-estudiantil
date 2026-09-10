package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.dto.PerfilResponseDTO;
import com.elp.usuarios_service.dto.PerfilUpdateRequest;
import com.elp.usuarios_service.dto.ExperienciaRequest;
import com.elp.usuarios_service.dto.EducacionRequest;
import com.elp.usuarios_service.dto.HabilidadRequest;
import com.elp.usuarios_service.security.UserDetailsImpl;
import com.elp.usuarios_service.service.PerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ContentDisposition;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<PerfilResponseDTO> obtenerMiPerfil(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null || userDetails.getUsuario() == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(perfilService.obtenerMiPerfil(userDetails.getUsuario().getId()));
    }

    @PostMapping("/cv")
    public ResponseEntity<Void> subirCv(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam("file") MultipartFile file) {
        if (userDetails == null || userDetails.getUsuario() == null) {
            return ResponseEntity.status(401).build();
        }
        perfilService.subirCv(userDetails.getUsuario().getId(), file);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/cv-portafolio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PerfilResponseDTO> subirCvPortafolio(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam("file") MultipartFile file) {
        if (userDetails == null || userDetails.getUsuario() == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(perfilService.subirCvPortafolio(userDetails.getUsuario().getId(), file));
    }

    @GetMapping("/cv-portafolio/archivo")
    public ResponseEntity<byte[]> descargarCvPortafolio(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null || userDetails.getUsuario() == null) return ResponseEntity.status(401).build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.inline().filename("CV_Candidato.pdf").build());
        return ResponseEntity.ok().headers(headers)
                .body(perfilService.descargarCvPortafolio(userDetails.getUsuario().getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<PerfilResponseDTO> actualizarPerfil(@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody PerfilUpdateRequest request) {
        return ResponseEntity.ok(perfilService.actualizarPerfil(userDetails.getUsuario().getId(), request));
    }

    @PostMapping("/experiencias")
    public ResponseEntity<PerfilResponseDTO.ExperienciaDTO> agregarExperiencia(@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody ExperienciaRequest request) {
        return ResponseEntity.ok(perfilService.agregarExperiencia(userDetails.getUsuario().getId(), request));
    }

    @DeleteMapping("/experiencias/{id}")
    public ResponseEntity<Void> eliminarExperiencia(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable UUID id) {
        perfilService.eliminarExperiencia(userDetails.getUsuario().getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/educacion")
    public ResponseEntity<PerfilResponseDTO.EducacionDTO> agregarEducacion(@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody EducacionRequest request) {
        return ResponseEntity.ok(perfilService.agregarEducacion(userDetails.getUsuario().getId(), request));
    }

    @DeleteMapping("/educacion/{id}")
    public ResponseEntity<Void> eliminarEducacion(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable UUID id) {
        perfilService.eliminarEducacion(userDetails.getUsuario().getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/habilidades")
    public ResponseEntity<PerfilResponseDTO.HabilidadDTO> agregarHabilidad(@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody HabilidadRequest request) {
        return ResponseEntity.ok(perfilService.agregarHabilidad(userDetails.getUsuario().getId(), request));
    }

    @DeleteMapping("/habilidades/{id}")
    public ResponseEntity<Void> eliminarHabilidad(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable UUID id) {
        perfilService.eliminarHabilidad(userDetails.getUsuario().getId(), id);
        return ResponseEntity.noContent().build();
    }
}
