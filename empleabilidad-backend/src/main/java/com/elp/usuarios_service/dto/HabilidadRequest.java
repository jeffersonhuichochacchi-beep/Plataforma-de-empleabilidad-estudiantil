package com.elp.usuarios_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HabilidadRequest {
    @NotBlank private String nombre;
    private String nivel;
    private Integer anosExperiencia;
}
