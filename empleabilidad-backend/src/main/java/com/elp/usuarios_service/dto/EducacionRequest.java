package com.elp.usuarios_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EducacionRequest {
    @NotBlank private String institucion;
    @NotBlank private String carrera;
    private String grado;
    @NotNull private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Boolean actual;
    private String descripcion;
}
