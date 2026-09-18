package com.elp.ofertas_service.controller;

import com.elp.ofertas_service.dto.OfertaResumenDTO;
import com.elp.ofertas_service.entity.Oferta;
import com.elp.ofertas_service.repository.OfertaRepository;
import com.elp.ofertas_service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/ofertas/internos")
@RequiredArgsConstructor
public class OfertaInternaController {

    private final OfertaRepository ofertaRepository;

    @GetMapping("/{uuid}/validacion")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OfertaResumenDTO> validarOferta(@PathVariable UUID uuid) {
        Oferta oferta = ofertaRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta no encontrada con ID: " + uuid));

        OfertaResumenDTO resumen = OfertaResumenDTO.builder()
                .ofertaId(oferta.getId())
                .empresaId(oferta.getEmpresaId())
                .titulo(oferta.getTitulo())
                .estado(oferta.getEstado().name())
                .aceptaPostulaciones(oferta.getAceptaPostulaciones())
                .build();

        return ResponseEntity.ok(resumen);
    }

    @PatchMapping("/{uuid}/postulaciones")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> registrarPostulacion(@PathVariable UUID uuid) {
        Oferta oferta = ofertaRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta no encontrada con ID: " + uuid));
        oferta.setNumeroPostulaciones((oferta.getNumeroPostulaciones() == null ? 0 : oferta.getNumeroPostulaciones()) + 1);
        ofertaRepository.save(oferta);
        return ResponseEntity.noContent().build();
    }
}
