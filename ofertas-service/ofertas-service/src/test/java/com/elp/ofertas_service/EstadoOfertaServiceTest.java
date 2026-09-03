package com.elp.ofertas_service;

import com.elp.ofertas_service.enums.EstadoOferta;
import com.elp.ofertas_service.exception.InvalidStateTransitionException;
import com.elp.ofertas_service.service.EstadoOfertaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EstadoOfertaServiceTest {

    private EstadoOfertaService estadoOfertaService;

    @BeforeEach
    void setUp() {
        estadoOfertaService = new EstadoOfertaService();
    }

    @Test
    void debePermitirBorradorAPublicada() {
        assertDoesNotThrow(() -> estadoOfertaService.validarTransicion(EstadoOferta.BORRADOR, EstadoOferta.PUBLICADA));
    }

    @Test
    void debePermitirBorradorACancelada() {
        assertDoesNotThrow(() -> estadoOfertaService.validarTransicion(EstadoOferta.BORRADOR, EstadoOferta.CANCELADA));
    }

    @Test
    void noDebePermitirBorradorAPausada() {
        assertThrows(InvalidStateTransitionException.class, () -> estadoOfertaService.validarTransicion(EstadoOferta.BORRADOR, EstadoOferta.PAUSADA));
    }

    @Test
    void noDebePermitirCerradaAPublicada() {
        assertThrows(InvalidStateTransitionException.class, () -> estadoOfertaService.validarTransicion(EstadoOferta.CERRADA, EstadoOferta.PUBLICADA));
    }
}