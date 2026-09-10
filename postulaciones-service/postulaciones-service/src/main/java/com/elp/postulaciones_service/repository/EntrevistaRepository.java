package com.elp.postulaciones_service.repository;

import com.elp.postulaciones_service.model.Entrevista;
import com.elp.postulaciones_service.model.Postulacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EntrevistaRepository extends JpaRepository<Entrevista, UUID> {
    Optional<Entrevista> findByUuid(UUID uuid);
    Page<Entrevista> findByPostulacion(Postulacion postulacion, Pageable pageable);
    @Query(value = "select e from Entrevista e join fetch e.postulacion p where p.candidatoId = :candidatoId order by e.fechaHora asc",
           countQuery = "select count(e) from Entrevista e where e.postulacion.candidatoId = :candidatoId")
    Page<Entrevista> findByPostulacionCandidatoId(@Param("candidatoId") UUID candidatoId, Pageable pageable);
    void deleteByPostulacion(Postulacion postulacion);
}
