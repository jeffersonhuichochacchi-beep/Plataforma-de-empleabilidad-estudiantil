package com.elp.usuarios_service.service;

import com.elp.usuarios_service.dto.*;
import com.elp.usuarios_service.exception.CuentaBloqueadaException;
import com.elp.usuarios_service.model.Empresa;
import com.elp.usuarios_service.model.Estudiante;
import com.elp.usuarios_service.model.UsuarioBase;
import com.elp.usuarios_service.model.enums.EstadoCuenta;
import com.elp.usuarios_service.model.enums.Rol;
import com.elp.usuarios_service.repository.EmpresaRepository;
import com.elp.usuarios_service.repository.EstudianteRepository;
import com.elp.usuarios_service.repository.UsuarioBaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioBaseRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final EmpresaRepository empresaRepository;
    private final SupabaseAuthClient supabaseAuthClient;

    public AuthResponse login(LoginRequest request) {
        SupabaseAuthClient.Session session = supabaseAuthClient.login(request.getEmail(), request.getPassword());
        UsuarioBase usuario = usuarioRepository.findByAuthUserId(session.authUserId()).orElseThrow(() ->
                new com.elp.usuarios_service.exception.InvalidCredentialsException("No existe perfil para el usuario Auth"));
        if (Boolean.TRUE.equals(usuario.getBloqueado())
                || !Boolean.TRUE.equals(usuario.getActivo())
                || EstadoCuenta.BLOQUEADA.equals(usuario.getEstadoCuenta())) {
            throw new CuentaBloqueadaException("La cuenta está bloqueada o deshabilitada. Contacta al administrador.");
        }
        return AuthResponse.builder().token(session.accessToken()).build();
    }

    @Transactional
    public AuthResponse registrarEstudiante(RegisterEstudianteRequest request) {
        if (estudianteRepository.findByDni(request.getDni()).isPresent())
            throw new com.elp.usuarios_service.exception.DuplicateResourceException("El DNI ya está registrado");
        UUID authId = supabaseAuthClient.createUser(request.getEmail(), request.getPassword(), request.getTelefonoWhatsapp());
        Estudiante estudiante = Estudiante.builder().authUserId(authId).rol(Rol.ESTUDIANTE)
                .estadoCuenta(EstadoCuenta.PENDIENTE_VERIFICACION).dni(request.getDni())
                .nombres(request.getNombres()).apellidos(request.getApellidos())
                .enlacePortafolio(request.getEnlacePortafolio()).urlCvPdf(request.getUrlCvPdf()).build();
        estudianteRepository.save(estudiante);
        return AuthResponse.builder().token(supabaseAuthClient.login(request.getEmail(), request.getPassword()).accessToken()).build();
    }

    @Transactional
    public AuthResponse registrarEmpresa(RegisterEmpresaRequest request) {
        if (empresaRepository.findByRuc(request.getRuc()).isPresent())
            throw new com.elp.usuarios_service.exception.DuplicateResourceException("El RUC ya está registrado");
        UUID authId = supabaseAuthClient.createUser(request.getEmail(), request.getPassword(), request.getTelefonoWhatsapp());
        Empresa empresa = Empresa.builder().authUserId(authId).rol(Rol.EMPRESA)
                .estadoCuenta(EstadoCuenta.PENDIENTE_VERIFICACION).ruc(request.getRuc())
                .razonSocial(request.getRazonSocial()).nombreComercial(request.getNombreComercial())
                .sitioWeb(request.getSitioWeb()).build();
        empresaRepository.save(empresa);
        return AuthResponse.builder().token(supabaseAuthClient.login(request.getEmail(), request.getPassword()).accessToken()).build();
    }

    public UsuarioResponseDTO obtenerUsuarioActual(String authUserId, String email) {
        UsuarioBase usuario = usuarioRepository.findByAuthUserId(UUID.fromString(authUserId)).orElseThrow(() ->
                new com.elp.usuarios_service.exception.InvalidCredentialsException("Usuario no encontrado"));
        String nombre = "";
        if (usuario instanceof Estudiante e) nombre = e.getNombres() + " " + e.getApellidos();
        else if (usuario instanceof Empresa e) nombre = e.getRazonSocial();
        return UsuarioResponseDTO.builder().id(usuario.getId()).email(email).rol(usuario.getRol()).nombre(nombre)
                .estadoCuenta(usuario.getEstadoCuenta()).emailVerificado(true).build();
    }
}
