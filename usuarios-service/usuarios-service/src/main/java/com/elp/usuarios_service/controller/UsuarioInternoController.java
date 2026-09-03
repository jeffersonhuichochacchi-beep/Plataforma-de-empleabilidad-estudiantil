package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.dto.UsuarioResumenDTO;
import com.elp.usuarios_service.model.UsuarioBase;
import com.elp.usuarios_service.model.Estudiante;
import com.elp.usuarios_service.model.Empresa;
import com.elp.usuarios_service.repository.UsuarioBaseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios/internos")
@RequiredArgsConstructor
public class UsuarioInternoController {

    private final UsuarioBaseRepository usuarioRepository;

    @GetMapping("/{uuid}/resumen")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UsuarioResumenDTO> obtenerResumen(@PathVariable UUID uuid) {
        UsuarioBase usuario = usuarioRepository.findById(uuid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con UUID: " + uuid));

        String nombreCompleto = "";
        if (usuario instanceof Estudiante) {
            Estudiante e = (Estudiante) usuario;
            nombreCompleto = e.getNombres() + " " + e.getApellidos();
        } else if (usuario instanceof Empresa) {
            Empresa e = (Empresa) usuario;
            nombreCompleto = e.getNombreComercial() != null ? e.getNombreComercial() : e.getRazonSocial();
        }

        UsuarioResumenDTO resumen = UsuarioResumenDTO.builder()
                .uuid(usuario.getUuid())
                .nombreCompleto(nombreCompleto)
                .email(usuario.getEmail())
                .fotoPerfil(usuario.getFotoPerfil())
                .rol(usuario.getRol().name())
                .build();

        return ResponseEntity.ok(resumen);
    }
}
