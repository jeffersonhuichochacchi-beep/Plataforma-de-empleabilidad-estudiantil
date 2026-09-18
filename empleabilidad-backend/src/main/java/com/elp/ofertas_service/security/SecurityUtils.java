package com.elp.ofertas_service.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityUtils {

    public static UUID getUsuarioLogueadoId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) return UUID.fromString(authentication.getName());
        throw new IllegalStateException("Usuario no autenticado");
    }

    public static String getRolUsuarioLogueado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !authentication.getAuthorities().isEmpty()) return authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        return null;
    }
}
