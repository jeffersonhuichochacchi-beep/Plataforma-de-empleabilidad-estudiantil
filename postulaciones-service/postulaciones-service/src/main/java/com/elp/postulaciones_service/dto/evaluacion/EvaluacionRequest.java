package com.elp.postulaciones_service.dto.evaluacion;

import com.elp.postulaciones_service.model.enums.RecomendacionEvaluacion;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EvaluacionRequest {
    @NotNull(message = "El puntaje es obligatorio")
    @Min(value = 0, message = "El puntaje no puede ser menor a 0")
    @Max(value = 100, message = "El puntaje no puede ser mayor a 100")
    private Integer puntaje;

    private String comentario;
    private String fortalezas;
    private String debilidades;

    @NotNull(message = "La recomendacion es obligatoria")
    private RecomendacionEvaluacion recomendacion;
}