package com.elp.usuarios_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ExperienciaRequest {
    @NotBlank private String empresa;
    @NotBlank private String cargo;
    private String descripcion;
    @NotNull private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Boolean actual;
    private String ubicacion;
    private String modalidad;
}
