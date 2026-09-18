package com.elp.postulaciones_service.repository;

import com.elp.postulaciones_service.model.EvaluacionPostulacion;
import com.elp.postulaciones_service.model.Postulacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EvaluacionPostulacionRepository extends JpaRepository<EvaluacionPostulacion, UUID> {
    Optional<EvaluacionPostulacion> findByUuid(UUID uuid);
    Page<EvaluacionPostulacion> findByPostulacion(Postulacion postulacion, Pageable pageable);
    void deleteByPostulacion(Postulacion postulacion);
}