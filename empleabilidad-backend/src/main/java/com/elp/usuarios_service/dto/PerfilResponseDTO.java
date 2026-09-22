package com.elp.usuarios_service.dto;

import com.elp.usuarios_service.model.enums.EstadoPerfil;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PerfilResponseDTO {
    private UUID id;
    private String email;
    private String rol;
    private String nombreParaMostrar;
    private Integer porcentajeCompletitud;
    private EstadoPerfil estadoPerfil;
    private List<String> motivosPendientes;
    private Boolean puedeAccionar; 
    private String nombres;
    private String apellidos;
    private String telefono;
    private String fotoPerfil;
    private String biografia;
    private String tituloProfesional;
    private String ubicacion;
    private String enlacePortafolio;
    private List<ExperienciaDTO> experiencias;
    private List<EducacionDTO> educacion;
    private List<HabilidadDTO> habilidades;
    private String cvNombre;
    private String razonSocial;
    private String nombreComercial;
    private String ruc;
    private String emailCorporativo;
    private String sitioWeb;
    private String industria;
    private String tamano;
    private String direccion;
    private String descripcion;
    private String logo;
    private String bannerColor;
    private String estadoVerificacion;
    private List<String> beneficios;
    private RedesDTO redes;

    @Data
    @Builder
    public static class RedesDTO {
        private String linkedin;
        private String twitter;
        private String github;
    }

    @Data
    @Builder
    public static class ExperienciaDTO {
        private UUID id;
        private String empresa;
        private String cargo;
        private String descripcion;
        private String fechaInicio;
        private String fechaFin;
        private Boolean actual;
        private String ubicacion;
        private String modalidad;
    }

    @Data
    @Builder
    public static class EducacionDTO {
        private UUID id;
        private String institucion;
        private String carrera;
        private String grado;
        private String fechaInicio;
        private String fechaFin;
        private Boolean actual;
        private String descripcion;
    }

    @Data
    @Builder
    public static class HabilidadDTO {
        private UUID id;
        private String nombre;
        private String nivel;
        private Integer anosExperiencia;
    }
}
