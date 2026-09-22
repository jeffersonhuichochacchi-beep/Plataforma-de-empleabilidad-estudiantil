package com.elp.usuarios_service.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PerfilUpdateRequest {
    @Size(max = 100) private String nombres;
    @Size(max = 100) private String apellidos;
    @Size(max = 30) private String telefono;
    @Size(max = 180) private String tituloProfesional;
    @Size(max = 180) private String ubicacion;
    private String biografia;
    @Size(max = 300) private String enlacePortafolio;

    // Campos editables del perfil empresarial
    @Size(max = 255) private String razonSocial;
    @Size(max = 255) private String nombreComercial;
    @Size(max = 255) private String emailCorporativo;
    @Size(max = 255) private String sitioWeb;
    @Size(max = 255) private String industria;
    @Size(max = 255) private String tamano;
    @Size(max = 255) private String direccion;
    @Size(max = 255) private String descripcion;
    @Size(max = 255) private String logo;
    @Size(max = 100) private String bannerColor;
    private List<@Size(max = 100) String> beneficios;
    @Size(max = 255) private String linkedin;
    @Size(max = 255) private String twitter;
    @Size(max = 255) private String github;
}
