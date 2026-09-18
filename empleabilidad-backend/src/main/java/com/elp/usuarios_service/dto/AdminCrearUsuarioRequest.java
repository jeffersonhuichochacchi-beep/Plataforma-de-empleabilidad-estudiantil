package com.elp.usuarios_service.dto;

import com.elp.usuarios_service.model.enums.Rol;

public record AdminCrearUsuarioRequest(String nombreCompleto, String email, Rol rol, String telefono, String ruc, String sector) {}
