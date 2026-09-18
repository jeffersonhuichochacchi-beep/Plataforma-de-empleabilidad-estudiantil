package com.elp.postulaciones_service.controller;

import com.elp.postulaciones_service.model.enums.EstadoPostulacion;
import com.elp.postulaciones_service.repository.EntrevistaRepository;
import com.elp.postulaciones_service.repository.PostulacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final PostulacionRepository postulacionRepository;
    private final EntrevistaRepository entrevistaRepository;

    @GetMapping("/resumen")
    public Map<String, Long> resumen() {
        return Map.of(
            "totalPostulaciones", postulacionRepository.count(),
            "enviadas", postulacionRepository.countByEstado(EstadoPostulacion.ENVIADA),
            "enRevision", postulacionRepository.countByEstado(EstadoPostulacion.EN_REVISION),
            "preseleccionadas", postulacionRepository.countByEstado(EstadoPostulacion.PRESELECCIONADA),
            "entrevistas", postulacionRepository.countByEstado(EstadoPostulacion.ENTREVISTA),
            "seleccionadas", postulacionRepository.countByEstado(EstadoPostulacion.SELECCIONADA),
            "rechazadas", postulacionRepository.countByEstado(EstadoPostulacion.RECHAZADA),
            "totalEntrevistas", entrevistaRepository.count()
        );
    }
}
