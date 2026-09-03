package com.elp.ofertas_service.repository;

import com.elp.ofertas_service.entity.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, UUID>, JpaSpecificationExecutor<Oferta> {
    boolean existsByCategoriaId(UUID categoriaId);
}