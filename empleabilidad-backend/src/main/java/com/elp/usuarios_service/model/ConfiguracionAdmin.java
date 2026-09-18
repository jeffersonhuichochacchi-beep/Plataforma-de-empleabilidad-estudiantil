package com.elp.usuarios_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "configuraciones_admin", schema = "public")
public class ConfiguracionAdmin {
    @Id
    private String id;
    @Column(columnDefinition = "TEXT")
    private String valor;
    private Instant actualizadoEn;
    protected ConfiguracionAdmin() {}
    public ConfiguracionAdmin(String id, String valor) { this.id = id; this.valor = valor; this.actualizadoEn = Instant.now(); }
    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; this.actualizadoEn = Instant.now(); }
}

