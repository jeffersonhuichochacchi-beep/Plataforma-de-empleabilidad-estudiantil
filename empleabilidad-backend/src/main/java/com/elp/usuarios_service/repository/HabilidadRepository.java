package com.elp.usuarios_service.repository;

import com.elp.usuarios_service.model.Habilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository("usuariosHabilidadRepository")
public interface HabilidadRepository extends JpaRepository<Habilidad, UUID> {
    java.util.Optional<Habilidad> findByNombreIgnoreCase(String nombre);
}
