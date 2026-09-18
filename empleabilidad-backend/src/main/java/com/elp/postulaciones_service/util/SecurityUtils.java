package com.elp.postulaciones_service.util;

import com.elp.postulaciones_service.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public class SecurityUtils {

    public static UUID getUsuarioLogueadoId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) return UUID.fromString(authentication.getName());
        throw new UnauthorizedException("No se encontro un usuario autenticado");
    }

    public static String getRolUsuarioLogueado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !authentication.getAuthorities().isEmpty()) return authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        return null;
    }

    public static String getJwtToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwt.getTokenValue();
        }
        throw new UnauthorizedException("No se encontro un token JWT en el contexto");
    }
}
