package com.elp.usuarios_service.config;

import com.elp.usuarios_service.model.Administrador;
import com.elp.usuarios_service.model.enums.EstadoCuenta;
import com.elp.usuarios_service.model.enums.Rol;
import com.elp.usuarios_service.repository.UsuarioBaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminBootstrap implements CommandLineRunner {

    private final UsuarioBaseRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.seed.enabled:true}")
    private boolean enabled;

    @Value("${app.admin.seed.email:admin@empleapro.local}")
    private String email;

    @Value("${app.admin.seed.password:Admin123!}")
    private String password;

    @Override
    public void run(String... args) {
        if (!enabled || usuarioRepository.findByEmail(email).isPresent()) {
            return;
        }

        Administrador admin = Administrador.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .rol(Rol.ADMINISTRADOR)
                .estadoCuenta(EstadoCuenta.ACTIVA)
                .emailVerificado(true)
                .telefonoVerificado(true)
                .activo(true)
                .bloqueado(false)
                .build();

        usuarioRepository.save(admin);
        log.warn("Usuario administrador de desarrollo creado: {}", email);
    }
}
