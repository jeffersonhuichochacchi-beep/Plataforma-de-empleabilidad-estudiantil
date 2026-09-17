package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.model.enums.EstadoCuenta;
import com.elp.usuarios_service.model.enums.Rol;
import com.elp.usuarios_service.repository.EmpresaRepository;
import com.elp.usuarios_service.repository.EstudianteRepository;
import com.elp.usuarios_service.repository.UsuarioBaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final UsuarioBaseRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final EmpresaRepository empresaRepository;

    @GetMapping("/resumen")
    public Map<String, Long> resumen() {
        return Map.of(
            "totalUsuarios", usuarioRepository.count(),
            "usuariosActivos", usuarioRepository.countByActivoTrue(),
            "candidatos", estudianteRepository.count(),
            "empresas", empresaRepository.count(),
            "profesionales", usuarioRepository.countByRol(Rol.PROFESIONAL),
            "usuariosPendientes", usuarioRepository.countByEstadoCuenta(EstadoCuenta.PENDIENTE_VERIFICACION),
            "administradores", usuarioRepository.countByRol(Rol.ADMINISTRADOR)
        );
    }
}
