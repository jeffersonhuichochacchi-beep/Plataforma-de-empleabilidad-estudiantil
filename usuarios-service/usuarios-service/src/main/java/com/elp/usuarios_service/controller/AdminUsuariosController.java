package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.dto.AdminUsuarioResponse;
import com.elp.usuarios_service.dto.AdminCrearUsuarioRequest;
import com.elp.usuarios_service.model.Empresa;
import com.elp.usuarios_service.model.Estudiante;
import com.elp.usuarios_service.model.UsuarioBase;
import com.elp.usuarios_service.model.enums.EstadoCuenta;
import com.elp.usuarios_service.model.enums.Rol;
import com.elp.usuarios_service.repository.EmpresaRepository;
import com.elp.usuarios_service.repository.UsuarioBaseRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
public class AdminUsuariosController {
    private final UsuarioBaseRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public AdminUsuarioResponse crear(@RequestBody AdminCrearUsuarioRequest request) {
        if (request.email() == null || request.email().isBlank() || request.nombreCompleto() == null || request.nombreCompleto().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre y correo son obligatorios");
        if (usuarioRepository.findByEmail(request.email()).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        Rol rol = request.rol() == null ? Rol.ESTUDIANTE : request.rol();
        UsuarioBase user;
        if (rol == Rol.EMPRESA || rol == Rol.RECLUTADOR) {
            Empresa empresa = Empresa.builder().email(request.email()).password(passwordEncoder.encode("Temporal123!"))
                .telefono(request.telefono()).rol(rol).estadoCuenta(EstadoCuenta.ACTIVA)
                .ruc(request.ruc() == null || request.ruc().isBlank() ? String.valueOf(System.currentTimeMillis()).substring(0, 11) : request.ruc())
                .razonSocial(request.nombreCompleto()).industria(request.sector()).estadoVerificacion("VERIFICADA").build();
            user = empresa;
        } else if (rol == Rol.ESTUDIANTE || rol == Rol.PROFESIONAL) {
            String[] parts = request.nombreCompleto().trim().split("\\s+", 2);
            Estudiante estudiante = Estudiante.builder().email(request.email()).password(passwordEncoder.encode("Temporal123!"))
                .telefono(request.telefono()).rol(rol).estadoCuenta(EstadoCuenta.ACTIVA).dni(String.valueOf(System.currentTimeMillis()).substring(0, 8))
                .nombres(parts[0]).apellidos(parts.length > 1 ? parts[1] : "Sin apellido").build();
            user = estudiante;
        } else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol no habilitado para creación administrativa");
        return AdminUsuarioResponse.from(usuarioRepository.save(user));
    }

    @GetMapping
    public Page<AdminUsuarioResponse> listar(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) Rol rol,
        @RequestParam(required = false) EstadoCuenta estado,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "100") int size
    ) {
        int safeSize = Math.min(Math.max(size, 1), 500);
        Pageable pageable = PageRequest.of(Math.max(page, 0), safeSize, Sort.by(Sort.Direction.DESC, "fechaRegistro"));
        return usuarioRepository.buscarAdministrativos(q == null ? "" : q.trim().toLowerCase(), rol, estado, pageable)
            .map(AdminUsuarioResponse::from);
    }

    @GetMapping("/roles/resumen")
    public Map<String, Long> resumenRoles() {
        return Map.of(
            "ADMINISTRADOR", usuarioRepository.countByRol(Rol.ADMINISTRADOR),
            "EMPRESA", usuarioRepository.countByRol(Rol.EMPRESA),
            "RECLUTADOR", usuarioRepository.countByRol(Rol.RECLUTADOR),
            "ESTUDIANTE", usuarioRepository.countByRol(Rol.ESTUDIANTE),
            "PROFESIONAL", usuarioRepository.countByRol(Rol.PROFESIONAL)
        );
    }

    @PatchMapping("/{id}/bloqueo")
    public AdminUsuarioResponse cambiarBloqueo(@PathVariable UUID id, @RequestBody BloqueoRequest request) {
        UsuarioBase user = find(id);
        user.setBloqueado(request.bloqueado());
        user.setActivo(!request.bloqueado());
        user.setEstadoCuenta(request.bloqueado() ? EstadoCuenta.BLOQUEADA : EstadoCuenta.ACTIVA);
        return AdminUsuarioResponse.from(usuarioRepository.save(user));
    }

    @PatchMapping("/{id}/verificar")
    public AdminUsuarioResponse verificarEmpresa(@PathVariable UUID id) {
        UsuarioBase user = find(id);
        if (!(user instanceof Empresa empresa)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario no es una empresa");
        empresa.setEstadoVerificacion("VERIFICADA");
        empresa.setFechaVerificacion(Timestamp.from(Instant.now()));
        empresa.setEstadoCuenta(EstadoCuenta.ACTIVA);
        empresa.setActivo(true);
        return AdminUsuarioResponse.from(usuarioRepository.save(empresa));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable UUID id) {
        if (!usuarioRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        usuarioRepository.deleteById(id);
    }

    private UsuarioBase find(UUID id) { return usuarioRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")); }
    public record BloqueoRequest(boolean bloqueado) {}
}
