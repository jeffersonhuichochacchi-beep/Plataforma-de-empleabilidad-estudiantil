package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.dto.AuthResponse;
import com.elp.usuarios_service.dto.LoginRequest;
import com.elp.usuarios_service.dto.RegisterEmpresaRequest;
import com.elp.usuarios_service.dto.RegisterEstudianteRequest;
import com.elp.usuarios_service.dto.UsuarioResponseDTO;
import com.elp.usuarios_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/registro/estudiante")
    public ResponseEntity<AuthResponse> registrarEstudiante(@Valid @RequestBody RegisterEstudianteRequest request) {
        return ResponseEntity.ok(authService.registrarEstudiante(request));
    }

    @PostMapping("/registro/empresa")
    public ResponseEntity<AuthResponse> registrarEmpresa(@Valid @RequestBody RegisterEmpresaRequest request) {
        return ResponseEntity.ok(authService.registrarEmpresa(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuarioActual(Authentication authentication, @AuthenticationPrincipal Jwt jwt) {
        // Authentication#getName() es el id interno asignado por el converter;
        // el perfil se relaciona con auth.users mediante el subject del JWT.
        return ResponseEntity.ok(authService.obtenerUsuarioActual(jwt.getSubject(), jwt.getClaimAsString("email")));
    }
}
