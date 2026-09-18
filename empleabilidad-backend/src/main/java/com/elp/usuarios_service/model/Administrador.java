package com.elp.usuarios_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "administradores", schema = "schema_usuarios")
@SuperBuilder
@NoArgsConstructor
public class Administrador extends UsuarioBase {
}
