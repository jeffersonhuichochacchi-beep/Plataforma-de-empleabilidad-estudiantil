package com.elp.usuarios_service.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.elp.usuarios_service.model.UsuarioBase;
import com.elp.usuarios_service.model.enums.EstadoCuenta;
import com.elp.usuarios_service.model.enums.Rol;

@Repository
public interface UsuarioBaseRepository extends JpaRepository<UsuarioBase, UUID> {
    Optional<UsuarioBase> findByAuthUserId(UUID authUserId);
    long countByActivoTrue();
    long countByEstadoCuenta(EstadoCuenta estadoCuenta);
    long countByRol(Rol rol);

    @Query("select u from UsuarioBase u where (:rol is null or u.rol = :rol) and (:estado is null or u.estadoCuenta = :estado)")
    Page<UsuarioBase> buscarAdministrativos(@Param("rol") Rol rol, @Param("estado") EstadoCuenta estado, Pageable pageable);
}
