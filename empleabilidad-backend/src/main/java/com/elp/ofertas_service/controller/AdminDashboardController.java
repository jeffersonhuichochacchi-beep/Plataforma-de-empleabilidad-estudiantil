package com.elp.ofertas_service.controller;

import com.elp.ofertas_service.enums.EstadoOferta;
import com.elp.ofertas_service.repository.CategoriaOfertaRepository;
import com.elp.ofertas_service.repository.OfertaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final OfertaRepository ofertaRepository;
    private final CategoriaOfertaRepository categoriaRepository;

    @GetMapping("/resumen")
    public Map<String, Long> resumen() {
        return Map.of(
            "totalOfertas", ofertaRepository.count(),
            "ofertasPublicadas", ofertaRepository.countByEstado(EstadoOferta.PUBLICADA),
            "ofertasPendientes", ofertaRepository.countByEstado(EstadoOferta.PENDIENTE_APROBACION),
            "ofertasRechazadas", ofertaRepository.countByEstado(EstadoOferta.RECHAZADA),
            "ofertasBorrador", ofertaRepository.countByEstado(EstadoOferta.BORRADOR),
            "ofertasPausadas", ofertaRepository.countByEstado(EstadoOferta.PAUSADA),
            "ofertasCerradas", ofertaRepository.countByEstado(EstadoOferta.CERRADA),
            "categorias", categoriaRepository.count()
        );
    }
}
