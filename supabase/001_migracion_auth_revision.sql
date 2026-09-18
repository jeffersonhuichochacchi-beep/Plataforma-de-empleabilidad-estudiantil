/*
  SUPABASE AUTH - SCRIPT DE REVISION
  Fuente: database-audit-report-2026-09-18.md + entidades JPA.
  Este archivo NO debe ejecutarse directamente en producción.
  El ROLLBACK final es intencional.

  Prerrequisitos antes de convertirlo en migración aplicable:
  - backup verificado;
  - proyecto Supabase de staging;
  - una fila de mapeo auth.users.id por cada schema_usuarios.usuarios.id;
  - revisión de la discrepancia del reporte: afirma 34 tablas, pero su inventario enumera 31.
*/

BEGIN;

CREATE SCHEMA IF NOT EXISTS schema_usuarios;
CREATE SCHEMA IF NOT EXISTS schema_ofertas;
CREATE SCHEMA IF NOT EXISTS schema_postulaciones;

-- La tabla Auth es propiedad de Supabase. No crear ni modificar auth.users aquí.
-- Mapeo obligatorio: completar con UUID reales antes de quitar columnas antiguas.
CREATE TEMP TABLE IF NOT EXISTS _auth_map (
  usuario_id uuid PRIMARY KEY,
  auth_user_id uuid NOT NULL UNIQUE
) ON COMMIT DROP;
-- INSERT INTO _auth_map (usuario_id, auth_user_id) VALUES ('...', '...');

/* =========================== USUARIOS =========================== */
CREATE TABLE IF NOT EXISTS schema_usuarios.usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE,
  foto_perfil varchar(255),
  rol varchar(40) NOT NULL,
  estado_cuenta varchar(40) NOT NULL DEFAULT 'PENDIENTE_VERIFICACION',
  activo boolean NOT NULL DEFAULT true,
  bloqueado boolean NOT NULL DEFAULT false,
  porcentaje_completitud integer NOT NULL DEFAULT 0,
  estado_perfil varchar(40),
  fecha_registro timestamp without time zone,
  fecha_actualizacion timestamp without time zone,
  ultimo_acceso timestamp without time zone,
  fecha_eliminacion timestamp without time zone
);

CREATE TABLE IF NOT EXISTS schema_usuarios.estudiantes (
  id uuid PRIMARY KEY REFERENCES schema_usuarios.usuarios(id),
  dni varchar(8) NOT NULL UNIQUE,
  nombres varchar(255) NOT NULL,
  apellidos varchar(255) NOT NULL,
  biografia text,
  titulo_profesional varchar(255),
  ubicacion varchar(255),
  enlace_portafolio varchar(255),
  url_cv_pdf varchar(255)
);
CREATE TABLE IF NOT EXISTS schema_usuarios.empresas (
  id uuid PRIMARY KEY REFERENCES schema_usuarios.usuarios(id),
  ruc varchar(11) NOT NULL UNIQUE,
  razon_social varchar(255) NOT NULL,
  nombre_comercial varchar(255), logo varchar(255), descripcion varchar(255),
  sitio_web varchar(255), industria varchar(255), tamano varchar(255),
  email_corporativo varchar(255), direccion varchar(255), ubicacion varchar(255),
  estado_verificacion varchar(40) DEFAULT 'PENDIENTE',
  fecha_verificacion timestamp without time zone
);
CREATE TABLE IF NOT EXISTS schema_usuarios.administradores (
  id uuid PRIMARY KEY REFERENCES schema_usuarios.usuarios(id)
);
CREATE TABLE IF NOT EXISTS schema_usuarios.educacion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  institucion varchar(255) NOT NULL, carrera varchar(255), nivel varchar(255),
  fecha_inicio date, fecha_fin date, actual boolean NOT NULL DEFAULT false, descripcion text
);
CREATE TABLE IF NOT EXISTS schema_usuarios.experiencias_laborales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  empresa varchar(255) NOT NULL, cargo varchar(255) NOT NULL, descripcion text,
  fecha_inicio date, fecha_fin date, actual boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS schema_usuarios.habilidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nombre varchar(255) NOT NULL UNIQUE,
  descripcion text, activo boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS schema_usuarios.perfil_habilidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  habilidad_id uuid NOT NULL REFERENCES schema_usuarios.habilidades(id), nivel varchar(40),
  CONSTRAINT uq_perfil_habilidad UNIQUE (usuario_id, habilidad_id)
);
CREATE TABLE IF NOT EXISTS schema_usuarios.idiomas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  idioma varchar(255) NOT NULL, nivel varchar(40) NOT NULL
);
CREATE TABLE IF NOT EXISTS schema_usuarios.certificaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  nombre varchar(255) NOT NULL, institucion varchar(255) NOT NULL, fecha_obtencion date,
  fecha_expiracion date, codigo_credencial varchar(255), url_verificacion varchar(255)
);
CREATE TABLE IF NOT EXISTS schema_usuarios.proyectos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  nombre varchar(255) NOT NULL, descripcion text, url varchar(255), tecnologias text
);
CREATE TABLE IF NOT EXISTS schema_usuarios.preferencias_laborales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL UNIQUE REFERENCES schema_usuarios.usuarios(id),
  modalidad varchar(40), jornada varchar(40), ubicacion varchar(255), salario_minimo numeric(12,2),
  tipo_contrato varchar(40), areas text
);
CREATE TABLE IF NOT EXISTS schema_usuarios.documentos_cv (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  nombre_archivo varchar(255) NOT NULL, url varchar(500) NOT NULL, tipo varchar(100), tamano bigint,
  fecha_subida timestamp without time zone
);
CREATE TABLE IF NOT EXISTS schema_usuarios.email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  token varchar(255) NOT NULL UNIQUE, fecha_expiracion timestamp without time zone NOT NULL,
  usado boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS schema_usuarios.password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  token varchar(255) NOT NULL UNIQUE, fecha_expiracion timestamp without time zone NOT NULL,
  usado boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS schema_usuarios.refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  token varchar(500) NOT NULL UNIQUE, fecha_expiracion timestamp without time zone NOT NULL,
  revocado boolean NOT NULL DEFAULT false, fecha_creacion timestamp without time zone
);
CREATE TABLE IF NOT EXISTS schema_usuarios.sesiones_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  token_hash varchar(255), ip varchar(100), user_agent text, fecha_inicio timestamp without time zone,
  fecha_expiracion timestamp without time zone, activa boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS schema_usuarios.auditoria_usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL REFERENCES schema_usuarios.usuarios(id),
  accion varchar(255) NOT NULL, fecha timestamp without time zone NOT NULL DEFAULT now(), ip varchar(100),
  user_agent varchar(1000), descripcion text
);
CREATE TABLE IF NOT EXISTS schema_usuarios.configuraciones_admin (
  id varchar(255) PRIMARY KEY, valor text, fecha_actualizacion timestamp with time zone
);

/* ============================ OFERTAS =========================== */
CREATE TABLE IF NOT EXISTS schema_ofertas.categorias_oferta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nombre varchar(255) NOT NULL UNIQUE, descripcion text,
  activo boolean NOT NULL DEFAULT true, fecha_creacion timestamptz, fecha_actualizacion timestamptz
);
CREATE TABLE IF NOT EXISTS schema_ofertas.habilidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nombre varchar(255) NOT NULL UNIQUE, descripcion text,
  activo boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS schema_ofertas.ofertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), empresa_id uuid NOT NULL, reclutador_id uuid NOT NULL,
  titulo varchar(255) NOT NULL, descripcion text NOT NULL, categoria_id uuid NOT NULL,
  area_profesional varchar(255), nivel_experiencia varchar(40), tipo_contrato varchar(40),
  modalidad varchar(40), jornada varchar(40), salario_minimo numeric(12,2), salario_maximo numeric(12,2),
  moneda varchar(20), ubicacion varchar(255), departamento varchar(255), provincia varchar(255), distrito varchar(255), pais varchar(255),
  fecha_publicacion timestamptz, fecha_vencimiento timestamptz, estado varchar(40) NOT NULL DEFAULT 'BORRADOR',
  acepta_postulaciones boolean NOT NULL DEFAULT false, fecha_creacion timestamptz, fecha_actualizacion timestamptz,
  fecha_cierre timestamptz, numero_vistas integer NOT NULL DEFAULT 0, numero_postulaciones integer NOT NULL DEFAULT 0,
  CONSTRAINT fk_oferta_empresa FOREIGN KEY (empresa_id) REFERENCES schema_usuarios.empresas(id),
  CONSTRAINT fk_oferta_categoria FOREIGN KEY (categoria_id) REFERENCES schema_ofertas.categorias_oferta(id),
  CONSTRAINT ck_oferta_salarios CHECK (salario_maximo IS NULL OR salario_minimo IS NULL OR salario_maximo >= salario_minimo)
);
CREATE TABLE IF NOT EXISTS schema_ofertas.ofertas_habilidades (
  oferta_id uuid NOT NULL REFERENCES schema_ofertas.ofertas(id), habilidad_id uuid NOT NULL REFERENCES schema_ofertas.habilidades(id),
  PRIMARY KEY (oferta_id, habilidad_id)
);
CREATE TABLE IF NOT EXISTS schema_ofertas.requisitos_oferta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), oferta_id uuid NOT NULL REFERENCES schema_ofertas.ofertas(id),
  descripcion text NOT NULL, tipo varchar(40) NOT NULL, obligatorio boolean NOT NULL DEFAULT true, nivel varchar(255)
);
CREATE TABLE IF NOT EXISTS schema_ofertas.auditoria_ofertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL, oferta_id uuid NOT NULL REFERENCES schema_ofertas.ofertas(id),
  accion varchar(255) NOT NULL, fecha timestamptz NOT NULL DEFAULT now(), trace_id varchar(255), descripcion text, ip varchar(100)
);

/* ========================= POSTULACIONES ======================== */
CREATE TABLE IF NOT EXISTS schema_postulaciones.postulaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), uuid uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  candidato_id uuid NOT NULL REFERENCES schema_usuarios.estudiantes(id), oferta_id uuid NOT NULL REFERENCES schema_ofertas.ofertas(id),
  empresa_id uuid NOT NULL REFERENCES schema_usuarios.empresas(id), fecha_postulacion timestamp without time zone,
  estado varchar(40) NOT NULL DEFAULT 'ENVIADA', carta_presentacion text, cv_url varchar(500), observaciones text,
  cumple_requerimientos boolean, porcentaje_coincidencia integer, resumen_ia text, habilidades_encontradas text,
  fecha_actualizacion timestamp without time zone, fecha_cierre timestamp without time zone,
  CONSTRAINT uq_postulacion_candidato_oferta UNIQUE (candidato_id, oferta_id)
);
CREATE TABLE IF NOT EXISTS schema_postulaciones.historial_postulaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), postulacion_id uuid NOT NULL REFERENCES schema_postulaciones.postulaciones(id),
  estado_anterior varchar(40), estado_nuevo varchar(40) NOT NULL, usuario_id uuid NOT NULL,
  fecha timestamp without time zone NOT NULL DEFAULT now(), comentario text
);
CREATE TABLE IF NOT EXISTS schema_postulaciones.entrevistas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), uuid uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  postulacion_id uuid NOT NULL REFERENCES schema_postulaciones.postulaciones(id), fecha_hora timestamp without time zone NOT NULL,
  duracion integer NOT NULL, tipo varchar(40) NOT NULL, ubicacion varchar(255), enlace varchar(500),
  estado varchar(40) NOT NULL DEFAULT 'PROGRAMADA', observaciones text, creado_por uuid NOT NULL,
  fecha_creacion timestamp without time zone, fecha_actualizacion timestamp without time zone
);
CREATE TABLE IF NOT EXISTS schema_postulaciones.evaluaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), uuid uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  postulacion_id uuid NOT NULL REFERENCES schema_postulaciones.postulaciones(id), evaluador_id uuid NOT NULL,
  puntaje integer NOT NULL, comentario text, fortalezas text, debilidades text, recomendacion varchar(40) NOT NULL,
  fecha_evaluacion timestamp without time zone
);
CREATE TABLE IF NOT EXISTS schema_postulaciones.auditoria_postulaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), usuario_id uuid NOT NULL, accion varchar(255) NOT NULL,
  fecha timestamp without time zone NOT NULL DEFAULT now(), ip varchar(100), user_agent varchar(1000), descripcion text
);
-- Se conserva expresamente por compatibilidad con el inventario auditado.
CREATE TABLE IF NOT EXISTS schema_postulaciones.ofertas_habilidades (
  oferta_id uuid NOT NULL, habilidad_id uuid NOT NULL, PRIMARY KEY (oferta_id, habilidad_id)
);

/* ======================= INDICES DEL BACKEND ===================== */
CREATE INDEX IF NOT EXISTS idx_oferta_empresa ON schema_ofertas.ofertas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_oferta_estado ON schema_ofertas.ofertas(estado);
CREATE INDEX IF NOT EXISTS idx_oferta_fecha_pub ON schema_ofertas.ofertas(fecha_publicacion);
CREATE INDEX IF NOT EXISTS idx_candidato ON schema_postulaciones.postulaciones(candidato_id);
CREATE INDEX IF NOT EXISTS idx_oferta ON schema_postulaciones.postulaciones(oferta_id);
CREATE INDEX IF NOT EXISTS idx_empresa ON schema_postulaciones.postulaciones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_estado ON schema_postulaciones.postulaciones(estado);
CREATE INDEX IF NOT EXISTS idx_historial_postulacion ON schema_postulaciones.historial_postulaciones(postulacion_id);
CREATE INDEX IF NOT EXISTS idx_entrevista_postulacion ON schema_postulaciones.entrevistas(postulacion_id);
CREATE INDEX IF NOT EXISTS idx_evaluacion_postulacion ON schema_postulaciones.evaluaciones(postulacion_id);

/* ============ CONVERSION DE UNA INSTALACION EXISTENTE ============ */
ALTER TABLE schema_usuarios.usuarios ADD COLUMN IF NOT EXISTS auth_user_id uuid;
UPDATE schema_usuarios.usuarios u SET auth_user_id = m.auth_user_id FROM _auth_map m WHERE u.id = m.usuario_id;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM schema_usuarios.usuarios WHERE auth_user_id IS NULL) THEN
    RAISE EXCEPTION 'REVIEW BLOCKED: falta mapear todos los usuarios a auth.users';
  END IF;
END $$;
ALTER TABLE schema_usuarios.usuarios DROP CONSTRAINT IF EXISTS uq_usuarios_auth_user_id;
ALTER TABLE schema_usuarios.usuarios ADD CONSTRAINT uq_usuarios_auth_user_id UNIQUE (auth_user_id);
ALTER TABLE schema_usuarios.usuarios ADD CONSTRAINT fk_usuarios_auth_user FOREIGN KEY (auth_user_id) REFERENCES auth.users(id);

-- Solo después de migrar el código y verificar Auth se deben quitar estos campos.
ALTER TABLE schema_usuarios.usuarios DROP COLUMN IF EXISTS email;
ALTER TABLE schema_usuarios.usuarios DROP COLUMN IF EXISTS password;
ALTER TABLE schema_usuarios.usuarios DROP COLUMN IF EXISTS telefono;
ALTER TABLE schema_usuarios.usuarios DROP COLUMN IF EXISTS email_verificado;
ALTER TABLE schema_usuarios.usuarios DROP COLUMN IF EXISTS telefono_verificado;

-- Comprobaciones de revisión; deben mostrar 31 tablas listadas por el reporte.
SELECT table_schema, count(*) AS tablas
FROM information_schema.tables
WHERE table_schema IN ('schema_usuarios','schema_ofertas','schema_postulaciones')
  AND table_type = 'BASE TABLE'
GROUP BY table_schema ORDER BY table_schema;

-- IMPORTANTE: revisión solamente. Quitar esta línea únicamente tras aprobación y backup.
ROLLBACK;
