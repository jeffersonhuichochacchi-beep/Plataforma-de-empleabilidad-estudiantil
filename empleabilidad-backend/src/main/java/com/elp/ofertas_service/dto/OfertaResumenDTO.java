package com.elp.ofertas_service.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class OfertaResumenDTO {
    private UUID ofertaId;
    private UUID empresaId;
    private String titulo;
    private String estado;
    private Boolean aceptaPostulaciones;
}
