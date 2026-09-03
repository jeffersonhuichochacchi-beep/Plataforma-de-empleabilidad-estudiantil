package com.elp.postulaciones_service.dto.postulacion;

import java.sql.Timestamp;
import java.util.UUID;

import com.elp.postulaciones_service.model.enums.EstadoPostulacion;

import lombok.Data;

@Data
public class PostulacionResponse {
    private UUID uuid;
    private UUID candidatoId;
    private UUID ofertaId;
    private UUID empresaId;
    private Timestamp fechaPostulacion;
    private EstadoPostulacion estado;
    private String cartaPresentacion;
    private String cvUrl;
    private String observaciones;
    private Timestamp fechaActualizacion;
    private Timestamp fechaCierre;
}
