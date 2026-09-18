package com.elp.ofertas_service.repository;

import com.elp.ofertas_service.entity.Oferta;
import com.elp.ofertas_service.enums.EstadoOferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, UUID>, JpaSpecificationExecutor<Oferta> {
    boolean existsByCategoriaId(UUID categoriaId);
    long countByEstado(EstadoOferta estado);

    @Query(value = "select count(*) from schema_postulaciones.postulaciones where oferta_id = :ofertaId and estado not in ('RETIRADA', 'CANCELADA')", nativeQuery = true)
    long countPostulaciones(@Param("ofertaId") UUID ofertaId);
}
