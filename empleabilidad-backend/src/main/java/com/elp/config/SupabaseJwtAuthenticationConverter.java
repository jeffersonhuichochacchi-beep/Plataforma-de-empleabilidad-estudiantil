package com.elp.config;

import com.elp.usuarios_service.repository.UsuarioBaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SupabaseJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    private final UsuarioBaseRepository usuarios;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        var usuario = usuarios.findByAuthUserId(java.util.UUID.fromString(jwt.getSubject()));
        var authorities = usuario.map(u -> List.of(new SimpleGrantedAuthority("ROLE_" + u.getRol().name())))
                .orElseGet(List::of);
        return new JwtAuthenticationToken(jwt, authorities, usuario.map(u -> u.getId().toString()).orElse(jwt.getSubject()));
    }
}
