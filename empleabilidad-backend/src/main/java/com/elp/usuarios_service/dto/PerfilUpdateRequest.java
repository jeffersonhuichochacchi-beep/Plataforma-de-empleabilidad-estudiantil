package com.elp.usuarios_service.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PerfilUpdateRequest {
    @Size(max = 100) private String nombres;
    @Size(max = 100) private String apellidos;
    @Size(max = 30) private String telefono;
    @Size(max = 180) private String tituloProfesional;
    @Size(max = 180) private String ubicacion;
    private String biografia;
    @Size(max = 300) private String enlacePortafolio;
}
