package com.elp.usuarios_service.dto;

import com.elp.usuarios_service.model.Empresa;
import com.elp.usuarios_service.model.Estudiante;
import com.elp.usuarios_service.model.UsuarioBase;

import java.sql.Timestamp;
import java.util.UUID;

public record AdminUsuarioResponse(
    UUID id, UUID uuid, String email, String rol, String estadoCuenta,
    boolean activo, boolean bloqueado, String nombreCompleto, String fotoPerfil,
    String telefono, Timestamp fechaRegistro, Timestamp ultimoAcceso,
    String ruc, String razonSocial, String sector, boolean verificada
) {
    public static AdminUsuarioResponse from(UsuarioBase user) {
        String nombre = user.getEmail();
        String ruc = null;
        String razonSocial = null;
        String sector = null;
        boolean verificada = false;
        if (user instanceof Estudiante estudiante) {
            nombre = (estudiante.getNombres() + " " + estudiante.getApellidos()).trim();
        } else if (user instanceof Empresa empresa) {
            nombre = empresa.getRazonSocial();
            ruc = empresa.getRuc();
            razonSocial = empresa.getRazonSocial();
            sector = empresa.getIndustria();
            verificada = "VERIFICADA".equalsIgnoreCase(empresa.getEstadoVerificacion());
        }
        return new AdminUsuarioResponse(user.getId(), user.getUuid(), user.getEmail(), user.getRol().name(),
            user.getEstadoCuenta().name(), Boolean.TRUE.equals(user.getActivo()), Boolean.TRUE.equals(user.getBloqueado()),
            nombre, user.getFotoPerfil(), user.getTelefono(), user.getFechaRegistro(), user.getUltimoAcceso(),
            ruc, razonSocial, sector, verificada);
    }
}
