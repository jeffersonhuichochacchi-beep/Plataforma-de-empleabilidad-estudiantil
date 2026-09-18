package com.elp.usuarios_service.repository;

import com.elp.usuarios_service.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, UUID> {
    Optional<Empresa> findByRuc(String ruc);
    Optional<Empresa> findByEmail(String email);
}
