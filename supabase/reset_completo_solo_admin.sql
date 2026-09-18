/*
  REINICIO COMPLETO DE EMPLEABILIDAD EN SUPABASE
  ADVERTENCIA: elimina todas las tablas y datos propios actuales.
  Conserva únicamente admin@empleapro.local en Supabase Auth.
  Ejecutar una sola vez en el SQL Editor del proyecto correcto.
*/
BEGIN;-- Tablas de la aplicación. CASCADE elimina sus FKs y datos actuales.
DROP TABLE IF EXISTS public.email_verification_tokens, public.password_reset_tokens, public.refresh_tokens, public.sesiones_usuario, public.auditoria_usuarios, public.documentos_cv, public.preferencias_laborales, public.proyectos, public.certificaciones, public.idiomas, public.experiencias_laborales, public.educacion, public.perfil_habilidades, public.estudiantes, public.empresas, public.administradores, public.postulaciones, public.historial_postulaciones, public.entrevistas, public.evaluaciones, public.auditoria_postulaciones, public.auditoria_ofertas, public.requisitos_oferta, public.ofertas_habilidades_postulaciones_legacy, public.ofertas_habilidades, public.ofertas, public.categorias_oferta, public.habilidades, public.configuraciones_admin, public.usuarios CASCADE;

-- Conserva solo la cuenta Auth del administrador.
DELETE FROM auth.users
WHERE lower(coalesce(email, '')) <> lower('admin@empleapro.local');
-- SUPABASE: estructura unificada de db_empleabilidad
-- Generado desde el dump auditado del proyecto. Ejecutar en SQL Editor de Supabase.
-- Requisito: crear Auth users desde Supabase Auth; nunca insertar contraseÃ±as en public.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: schema_ofertas; Type: SCHEMA; Schema: -; Owner: -
--




--
-- Name: schema_postulaciones; Type: SCHEMA; Schema: -; Owner: -
--




--
-- Name: schema_usuarios; Type: SCHEMA; Schema: -; Owner: -
--




SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auditoria_ofertas; Type: TABLE; Schema: schema_ofertas; Owner: -
--

CREATE TABLE public.auditoria_ofertas (
    id uuid NOT NULL,
    accion character varying(255) NOT NULL,
    descripcion text,
    fecha timestamp(6) with time zone NOT NULL,
    ip character varying(255),
    oferta_id uuid NOT NULL,
    trace_id character varying(255),
    usuario_id uuid NOT NULL
);


--
-- Name: categorias_oferta; Type: TABLE; Schema: schema_ofertas; Owner: -
--

CREATE TABLE public.categorias_oferta (
    id uuid NOT NULL,
    activo boolean NOT NULL,
    descripcion text,
    fecha_actualizacion timestamp(6) with time zone,
    fecha_creacion timestamp(6) with time zone,
    nombre character varying(255) NOT NULL
);


--
-- Name: habilidades; Type: TABLE; Schema: schema_ofertas; Owner: -
--

CREATE TABLE public.habilidades (
    id uuid NOT NULL,
    activo boolean NOT NULL,
    descripcion text,
    nombre character varying(255) NOT NULL
);


--
-- Name: ofertas; Type: TABLE; Schema: schema_ofertas; Owner: -
--

CREATE TABLE public.ofertas (
    id uuid NOT NULL,
    acepta_postulaciones boolean NOT NULL,
    area_profesional character varying(255),
    categoria_id uuid NOT NULL,
    departamento character varying(255),
    descripcion text NOT NULL,
    distrito character varying(255),
    empresa_id uuid NOT NULL,
    estado character varying(255) NOT NULL,
    fecha_actualizacion timestamp(6) with time zone,
    fecha_cierre timestamp(6) with time zone,
    fecha_creacion timestamp(6) with time zone,
    fecha_publicacion timestamp(6) with time zone,
    fecha_vencimiento timestamp(6) with time zone,
    jornada character varying(255),
    modalidad character varying(255),
    moneda character varying(255),
    nivel_experiencia character varying(255),
    numero_postulaciones integer NOT NULL,
    numero_vistas integer NOT NULL,
    pais character varying(255),
    provincia character varying(255),
    reclutador_id uuid NOT NULL,
    salario_maximo numeric(12,2),
    salario_minimo numeric(12,2),
    tipo_contrato character varying(255),
    titulo character varying(255) NOT NULL,
    ubicacion character varying(255),
    CONSTRAINT ofertas_estado_check CHECK (((estado)::text = ANY (ARRAY[('BORRADOR'::character varying)::text, ('PENDIENTE_APROBACION'::character varying)::text, ('RECHAZADA'::character varying)::text, ('PUBLICADA'::character varying)::text, ('PAUSADA'::character varying)::text, ('CERRADA'::character varying)::text, ('VENCIDA'::character varying)::text, ('CANCELADA'::character varying)::text]))),
    CONSTRAINT ofertas_jornada_check CHECK (((jornada)::text = ANY ((ARRAY['DIURNA'::character varying, 'NOCTURNA'::character varying, 'ROTATIVA'::character varying, 'FLEXIBLE'::character varying])::text[]))),
    CONSTRAINT ofertas_modalidad_check CHECK (((modalidad)::text = ANY ((ARRAY['PRESENCIAL'::character varying, 'REMOTO'::character varying, 'HIBRIDO'::character varying])::text[]))),
    CONSTRAINT ofertas_nivel_experiencia_check CHECK (((nivel_experiencia)::text = ANY ((ARRAY['SIN_EXPERIENCIA'::character varying, 'PRACTICANTE'::character varying, 'JUNIOR'::character varying, 'SEMI_SENIOR'::character varying, 'SENIOR'::character varying, 'EXPERTO'::character varying])::text[]))),
    CONSTRAINT ofertas_tipo_contrato_check CHECK (((tipo_contrato)::text = ANY ((ARRAY['TIEMPO_COMPLETO'::character varying, 'MEDIO_TIEMPO'::character varying, 'PRACTICAS'::character varying, 'TEMPORAL'::character varying, 'POR_PROYECTO'::character varying, 'FREELANCE'::character varying, 'OTRO'::character varying])::text[])))
);


--
-- Name: ofertas_habilidades; Type: TABLE; Schema: schema_ofertas; Owner: -
--

CREATE TABLE public.ofertas_habilidades (
    oferta_id uuid NOT NULL,
    habilidad_id uuid NOT NULL
);


--
-- Name: requisitos_oferta; Type: TABLE; Schema: schema_ofertas; Owner: -
--

CREATE TABLE public.requisitos_oferta (
    id uuid NOT NULL,
    descripcion text NOT NULL,
    nivel character varying(255),
    obligatorio boolean NOT NULL,
    tipo character varying(255) NOT NULL,
    oferta_id uuid NOT NULL,
    CONSTRAINT requisitos_oferta_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['EXPERIENCIA'::character varying, 'EDUCACION'::character varying, 'HABILIDAD'::character varying, 'IDIOMA'::character varying, 'CONOCIMIENTO'::character varying, 'OTRO'::character varying])::text[])))
);


--
-- Name: auditoria_postulaciones; Type: TABLE; Schema: schema_postulaciones; Owner: -
--

CREATE TABLE public.auditoria_postulaciones (
    id uuid NOT NULL,
    accion character varying(255) NOT NULL,
    descripcion text,
    fecha timestamp(6) without time zone NOT NULL,
    ip character varying(255),
    user_agent character varying(255),
    usuario_id uuid NOT NULL
);


--
-- Name: entrevistas; Type: TABLE; Schema: schema_postulaciones; Owner: -
--

CREATE TABLE public.entrevistas (
    id uuid NOT NULL,
    creado_por uuid NOT NULL,
    duracion integer NOT NULL,
    enlace character varying(255),
    estado character varying(255) NOT NULL,
    fecha_actualizacion timestamp(6) without time zone NOT NULL,
    fecha_creacion timestamp(6) without time zone NOT NULL,
    fecha_hora timestamp(6) without time zone NOT NULL,
    observaciones text,
    tipo character varying(255) NOT NULL,
    ubicacion character varying(255),
    uuid uuid NOT NULL,
    postulacion_id uuid NOT NULL,
    CONSTRAINT entrevistas_estado_check CHECK (((estado)::text = ANY ((ARRAY['PROGRAMADA'::character varying, 'CONFIRMADA'::character varying, 'REALIZADA'::character varying, 'CANCELADA'::character varying, 'NO_ASISTIO'::character varying, 'REPROGRAMADA'::character varying])::text[]))),
    CONSTRAINT entrevistas_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['VIRTUAL'::character varying, 'PRESENCIAL'::character varying, 'TELEFONICA'::character varying])::text[])))
);


--
-- Name: evaluaciones; Type: TABLE; Schema: schema_postulaciones; Owner: -
--

CREATE TABLE public.evaluaciones (
    id uuid NOT NULL,
    comentario text,
    debilidades text,
    evaluador_id uuid NOT NULL,
    fecha_evaluacion timestamp(6) without time zone NOT NULL,
    fortalezas text,
    puntaje integer NOT NULL,
    recomendacion character varying(255) NOT NULL,
    uuid uuid NOT NULL,
    postulacion_id uuid NOT NULL,
    CONSTRAINT evaluaciones_recomendacion_check CHECK (((recomendacion)::text = ANY (ARRAY[('RECOMENDADO'::character varying)::text, ('ACEPTABLE'::character varying)::text, ('NO_RECOMENDADO'::character varying)::text, ('PENDIENTE'::character varying)::text])))
);


--
-- Name: historial_postulaciones; Type: TABLE; Schema: schema_postulaciones; Owner: -
--

CREATE TABLE public.historial_postulaciones (
    id uuid NOT NULL,
    comentario text,
    estado_anterior character varying(255),
    estado_nuevo character varying(255) NOT NULL,
    fecha timestamp(6) without time zone NOT NULL,
    usuario_id uuid NOT NULL,
    postulacion_id uuid NOT NULL,
    CONSTRAINT historial_postulaciones_estado_anterior_check CHECK (((estado_anterior)::text = ANY ((ARRAY['ENVIADA'::character varying, 'RECIBIDA'::character varying, 'EN_REVISION'::character varying, 'PRESELECCIONADA'::character varying, 'ENTREVISTA'::character varying, 'EVALUACION'::character varying, 'SELECCIONADA'::character varying, 'RECHAZADA'::character varying, 'RETIRADA'::character varying, 'CANCELADA'::character varying, 'CERRADA'::character varying])::text[]))),
    CONSTRAINT historial_postulaciones_estado_nuevo_check CHECK (((estado_nuevo)::text = ANY ((ARRAY['ENVIADA'::character varying, 'RECIBIDA'::character varying, 'EN_REVISION'::character varying, 'PRESELECCIONADA'::character varying, 'ENTREVISTA'::character varying, 'EVALUACION'::character varying, 'SELECCIONADA'::character varying, 'RECHAZADA'::character varying, 'RETIRADA'::character varying, 'CANCELADA'::character varying, 'CERRADA'::character varying])::text[])))
);


--
-- Name: ofertas_habilidades; Type: TABLE; Schema: schema_postulaciones; Owner: -
--

CREATE TABLE public.ofertas_habilidades_postulaciones_legacy (
    oferta_id uuid NOT NULL,
    habilidad_id uuid NOT NULL
);


--
-- Name: postulaciones; Type: TABLE; Schema: schema_postulaciones; Owner: -
--

CREATE TABLE public.postulaciones (
    id uuid NOT NULL,
    candidato_id uuid NOT NULL,
    carta_presentacion text,
    cv_url character varying(255),
    empresa_id uuid NOT NULL,
    estado character varying(255) NOT NULL,
    fecha_actualizacion timestamp(6) without time zone NOT NULL,
    fecha_cierre timestamp(6) without time zone,
    fecha_postulacion timestamp(6) without time zone NOT NULL,
    observaciones text,
    oferta_id uuid NOT NULL,
    uuid uuid NOT NULL,
    cumple_requerimientos boolean,
    habilidades_encontradas text,
    porcentaje_coincidencia integer,
    resumen_ia text,
    CONSTRAINT postulaciones_estado_check CHECK (((estado)::text = ANY ((ARRAY['ENVIADA'::character varying, 'RECIBIDA'::character varying, 'EN_REVISION'::character varying, 'PRESELECCIONADA'::character varying, 'ENTREVISTA'::character varying, 'EVALUACION'::character varying, 'SELECCIONADA'::character varying, 'RECHAZADA'::character varying, 'RETIRADA'::character varying, 'CANCELADA'::character varying, 'CERRADA'::character varying])::text[])))
);


--
-- Name: administradores; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.administradores (
    id uuid NOT NULL
);


--
-- Name: auditoria_usuarios; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.auditoria_usuarios (
    id uuid NOT NULL,
    accion character varying(255) NOT NULL,
    descripcion text,
    fecha timestamp(6) without time zone NOT NULL,
    ip character varying(255),
    user_agent character varying(255),
    usuario_id uuid NOT NULL
);


--
-- Name: certificaciones; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.certificaciones (
    id uuid NOT NULL,
    codigo_credencial character varying(255),
    fecha_expiracion date,
    fecha_obtencion date,
    institucion character varying(255) NOT NULL,
    nombre character varying(255) NOT NULL,
    url_verificacion character varying(255),
    usuario_id uuid NOT NULL
);


--
-- Name: configuraciones_admin; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.configuraciones_admin (
    id character varying(255) NOT NULL,
    actualizado_en timestamp(6) with time zone,
    valor text
);


--
-- Name: documentos_cv; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.documentos_cv (
    id uuid NOT NULL,
    activo boolean NOT NULL,
    content_type character varying(255) NOT NULL,
    fecha_carga timestamp(6) without time zone NOT NULL,
    fecha_desactivacion timestamp(6) without time zone,
    nombre_original character varying(255) NOT NULL,
    storage_key character varying(255) NOT NULL,
    tamano_bytes bigint NOT NULL,
    usuario_id uuid NOT NULL
);


--
-- Name: educacion; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.educacion (
    id uuid NOT NULL,
    actual boolean,
    carrera character varying(255) NOT NULL,
    descripcion text,
    fecha_fin date,
    fecha_inicio date NOT NULL,
    grado character varying(255),
    institucion character varying(255) NOT NULL,
    usuario_id uuid NOT NULL
);


--
-- Name: email_verification_tokens; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.email_verification_tokens (
    id uuid NOT NULL,
    fecha_creacion timestamp(6) without time zone NOT NULL,
    fecha_expiracion timestamp(6) without time zone NOT NULL,
    fecha_uso timestamp(6) without time zone,
    token_hash character varying(255) NOT NULL,
    usado boolean,
    usuario_id uuid NOT NULL
);


--
-- Name: empresas; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.empresas (
    descripcion character varying(255),
    direccion character varying(255),
    email_corporativo character varying(255),
    estado_verificacion character varying(255),
    fecha_verificacion timestamp(6) without time zone,
    industria character varying(255),
    logo character varying(255),
    nombre_comercial character varying(255),
    razon_social character varying(255) NOT NULL,
    ruc character varying(11) NOT NULL,
    sitio_web character varying(255),
    tamano character varying(255),
    ubicacion character varying(255),
    id uuid NOT NULL,
    banner_color character varying(100),
    beneficios text,
    github_url character varying(255),
    linkedin_url character varying(255),
    twitter_url character varying(255)
);


--
-- Name: estudiantes; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.estudiantes (
    apellidos character varying(255) NOT NULL,
    biografia text,
    dni character varying(8) NOT NULL,
    enlace_portafolio character varying(255),
    nombres character varying(255) NOT NULL,
    titulo_profesional character varying(255),
    ubicacion character varying(255),
    url_cv_pdf character varying(255),
    id uuid NOT NULL
);


--
-- Name: experiencias_laborales; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.experiencias_laborales (
    id uuid NOT NULL,
    actual boolean,
    cargo character varying(255) NOT NULL,
    descripcion text,
    empresa character varying(255) NOT NULL,
    fecha_fin date,
    fecha_inicio date NOT NULL,
    modalidad character varying(255),
    ubicacion character varying(255),
    usuario_id uuid NOT NULL
);


--
-- Name: habilidades; Type: TABLE; Schema: schema_usuarios; Owner: -
--



--
-- Name: idiomas; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.idiomas (
    id uuid NOT NULL,
    nivel character varying(255) NOT NULL,
    nombre character varying(255) NOT NULL,
    usuario_id uuid NOT NULL
);


--
-- Name: password_reset_tokens; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    id uuid NOT NULL,
    fecha_creacion timestamp(6) without time zone NOT NULL,
    fecha_expiracion timestamp(6) without time zone NOT NULL,
    fecha_uso timestamp(6) without time zone,
    token_hash character varying(255) NOT NULL,
    usado boolean,
    usuario_id uuid NOT NULL
);


--
-- Name: perfil_habilidades; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.perfil_habilidades (
    id uuid NOT NULL,
    anos_experiencia integer,
    nivel character varying(255) NOT NULL,
    usuario_id uuid NOT NULL,
    habilidad_id uuid NOT NULL
);


--
-- Name: preferencias_laborales; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.preferencias_laborales (
    usuario_id uuid NOT NULL,
    disponibilidad character varying(255),
    modalidad character varying(255),
    puesto_deseado character varying(255),
    salario_maximo double precision,
    salario_minimo double precision,
    tipo_contrato character varying(255),
    ubicaciones character varying(255)
);


--
-- Name: proyectos; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.proyectos (
    id uuid NOT NULL,
    descripcion text,
    fecha_fin date,
    fecha_inicio date,
    github_url character varying(255),
    nombre character varying(255) NOT NULL,
    url character varying(255),
    usuario_id uuid NOT NULL
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id uuid NOT NULL,
    fecha_creacion timestamp(6) without time zone NOT NULL,
    fecha_expiracion timestamp(6) without time zone NOT NULL,
    fecha_revocacion timestamp(6) without time zone,
    ip character varying(255),
    revocado boolean,
    token_hash character varying(255) NOT NULL,
    user_agent character varying(255),
    usuario_id uuid NOT NULL
);


--
-- Name: sesiones_usuario; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.sesiones_usuario (
    id uuid NOT NULL,
    activa boolean,
    dispositivo character varying(255),
    fecha_expiracion timestamp(6) without time zone NOT NULL,
    fecha_inicio timestamp(6) without time zone NOT NULL,
    ip character varying(255),
    ultimo_acceso timestamp(6) without time zone,
    user_agent character varying(255),
    usuario_id uuid NOT NULL
);


--
-- Name: usuarios; Type: TABLE; Schema: schema_usuarios; Owner: -
--

CREATE TABLE public.usuarios (
    id uuid NOT NULL,
    activo boolean,
    bloqueado boolean,
    email character varying(255) NOT NULL,
    email_verificado boolean,
    estado_cuenta character varying(255) NOT NULL,
    estado_perfil character varying(255),
    fecha_actualizacion timestamp(6) without time zone NOT NULL,
    fecha_eliminacion timestamp(6) without time zone,
    fecha_registro timestamp(6) without time zone NOT NULL,
    foto_perfil character varying(255),
    password character varying(255) NOT NULL,
    porcentaje_completitud integer,
    rol character varying(255) NOT NULL,
    telefono character varying(255),
    telefono_verificado boolean,
    ultimo_acceso timestamp(6) without time zone,
    uuid uuid NOT NULL,
    CONSTRAINT usuarios_estado_cuenta_check CHECK (((estado_cuenta)::text = ANY ((ARRAY['PENDIENTE_VERIFICACION'::character varying, 'ACTIVA'::character varying, 'BLOQUEADA'::character varying, 'SUSPENDIDA'::character varying, 'ELIMINADA'::character varying])::text[]))),
    CONSTRAINT usuarios_estado_perfil_check CHECK (((estado_perfil)::text = ANY ((ARRAY['INCOMPLETO'::character varying, 'COMPLETO'::character varying])::text[]))),
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['ESTUDIANTE'::character varying, 'PROFESIONAL'::character varying, 'EMPRESA'::character varying, 'RECLUTADOR'::character varying, 'MODERADOR'::character varying, 'ADMINISTRADOR'::character varying])::text[])))
);


--
-- Name: auditoria_ofertas auditoria_ofertas_pkey; Type: CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.auditoria_ofertas
    ADD CONSTRAINT auditoria_ofertas_pkey PRIMARY KEY (id);


--
-- Name: categorias_oferta categorias_oferta_pkey; Type: CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.categorias_oferta
    ADD CONSTRAINT categorias_oferta_pkey PRIMARY KEY (id);


--
-- Name: habilidades habilidades_pkey; Type: CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_pkey PRIMARY KEY (id);


--
-- Name: ofertas_habilidades ofertas_habilidades_pkey; Type: CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.ofertas_habilidades
    ADD CONSTRAINT ofertas_habilidades_pkey PRIMARY KEY (oferta_id, habilidad_id);


--
-- Name: ofertas ofertas_pkey; Type: CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.ofertas
    ADD CONSTRAINT ofertas_pkey PRIMARY KEY (id);


--
-- Name: requisitos_oferta requisitos_oferta_pkey; Type: CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.requisitos_oferta
    ADD CONSTRAINT requisitos_oferta_pkey PRIMARY KEY (id);


--
-- Name: habilidades uk_7q84wgm6lyr5savxopxemstc7; Type: CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT uk_7q84wgm6lyr5savxopxemstc7 UNIQUE (nombre);


--
-- Name: categorias_oferta uk_f1hdmehwfajtrmr2q6qy0ea94; Type: CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.categorias_oferta
    ADD CONSTRAINT uk_f1hdmehwfajtrmr2q6qy0ea94 UNIQUE (nombre);


--
-- Name: auditoria_postulaciones auditoria_postulaciones_pkey; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.auditoria_postulaciones
    ADD CONSTRAINT auditoria_postulaciones_pkey PRIMARY KEY (id);


--
-- Name: entrevistas entrevistas_pkey; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.entrevistas
    ADD CONSTRAINT entrevistas_pkey PRIMARY KEY (id);


--
-- Name: evaluaciones evaluaciones_pkey; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_pkey PRIMARY KEY (id);


--
-- Name: historial_postulaciones historial_postulaciones_pkey; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.historial_postulaciones
    ADD CONSTRAINT historial_postulaciones_pkey PRIMARY KEY (id);


--
-- Name: ofertas_habilidades ofertas_habilidades_pkey; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.ofertas_habilidades_postulaciones_legacy
    ADD CONSTRAINT ofertas_habilidades_postulaciones_legacy_pkey PRIMARY KEY (oferta_id, habilidad_id);


--
-- Name: postulaciones postulaciones_pkey; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_pkey PRIMARY KEY (id);


--
-- Name: entrevistas uk72wdet9ut8n9iw80hx6upo2bl; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.entrevistas
    ADD CONSTRAINT uk72wdet9ut8n9iw80hx6upo2bl UNIQUE (uuid);


--
-- Name: evaluaciones ukknqxmpabnumy65l6tbx7im2rg; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT ukknqxmpabnumy65l6tbx7im2rg UNIQUE (uuid);


--
-- Name: postulaciones ukqmy1jrqjjdmr0w3l8h95sfhh0; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT ukqmy1jrqjjdmr0w3l8h95sfhh0 UNIQUE (uuid);


--
-- Name: postulaciones ukreh9c03h9v8mu20dblwq1p9vf; Type: CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT ukreh9c03h9v8mu20dblwq1p9vf UNIQUE (candidato_id, oferta_id);


--
-- Name: administradores administradores_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT administradores_pkey PRIMARY KEY (id);


--
-- Name: auditoria_usuarios auditoria_usuarios_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.auditoria_usuarios
    ADD CONSTRAINT auditoria_usuarios_pkey PRIMARY KEY (id);


--
-- Name: certificaciones certificaciones_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.certificaciones
    ADD CONSTRAINT certificaciones_pkey PRIMARY KEY (id);


--
-- Name: configuraciones_admin configuraciones_admin_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.configuraciones_admin
    ADD CONSTRAINT configuraciones_admin_pkey PRIMARY KEY (id);


--
-- Name: documentos_cv documentos_cv_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.documentos_cv
    ADD CONSTRAINT documentos_cv_pkey PRIMARY KEY (id);


--
-- Name: educacion educacion_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.educacion
    ADD CONSTRAINT educacion_pkey PRIMARY KEY (id);


--
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id);


--
-- Name: experiencias_laborales experiencias_laborales_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.experiencias_laborales
    ADD CONSTRAINT experiencias_laborales_pkey PRIMARY KEY (id);


--
-- Name: habilidades habilidades_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--


--
-- Name: idiomas idiomas_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.idiomas
    ADD CONSTRAINT idiomas_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: perfil_habilidades perfil_habilidades_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.perfil_habilidades
    ADD CONSTRAINT perfil_habilidades_pkey PRIMARY KEY (id);


--
-- Name: preferencias_laborales preferencias_laborales_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.preferencias_laborales
    ADD CONSTRAINT preferencias_laborales_pkey PRIMARY KEY (usuario_id);


--
-- Name: proyectos proyectos_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: sesiones_usuario sesiones_usuario_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.sesiones_usuario
    ADD CONSTRAINT sesiones_usuario_pkey PRIMARY KEY (id);


--
-- Name: habilidades uk7q84wgm6lyr5savxopxemstc7; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--


--
-- Name: email_verification_tokens ukah12jdrm74nfnmu11x9xxlbex; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT ukah12jdrm74nfnmu11x9xxlbex UNIQUE (token_hash);


--
-- Name: password_reset_tokens ukajre85ybxavf1tt4omkrs5p6g; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT ukajre85ybxavf1tt4omkrs5p6g UNIQUE (token_hash);


--
-- Name: empresas ukd6avi1g5t06l7qo67kj8ty2j2; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT ukd6avi1g5t06l7qo67kj8ty2j2 UNIQUE (ruc);


--
-- Name: documentos_cv ukeajn7a1p1mslsldqiu2x4x6nl; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.documentos_cv
    ADD CONSTRAINT ukeajn7a1p1mslsldqiu2x4x6nl UNIQUE (storage_key);


--
-- Name: estudiantes ukjk2tfkhim3wwtjv6me1utdnwn; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT ukjk2tfkhim3wwtjv6me1utdnwn UNIQUE (dni);


--
-- Name: usuarios ukkfsp0s1tflm1cwlj8idhqsad0; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT ukkfsp0s1tflm1cwlj8idhqsad0 UNIQUE (email);


--
-- Name: usuarios ukn030l6hv3nrwm3cqklvuyeopv; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT ukn030l6hv3nrwm3cqklvuyeopv UNIQUE (uuid);


--
-- Name: refresh_tokens uko2mlirhldriil2y7krapq4frt; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT uko2mlirhldriil2y7krapq4frt UNIQUE (token_hash);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_oferta_empresa; Type: INDEX; Schema: schema_ofertas; Owner: -
--

CREATE INDEX idx_oferta_empresa ON public.ofertas USING btree (empresa_id);


--
-- Name: idx_oferta_estado; Type: INDEX; Schema: schema_ofertas; Owner: -
--

CREATE INDEX idx_oferta_estado ON public.ofertas USING btree (estado);


--
-- Name: idx_oferta_fecha_pub; Type: INDEX; Schema: schema_ofertas; Owner: -
--

CREATE INDEX idx_oferta_fecha_pub ON public.ofertas USING btree (fecha_publicacion);


--
-- Name: idx_candidato; Type: INDEX; Schema: schema_postulaciones; Owner: -
--

CREATE INDEX idx_candidato ON public.postulaciones USING btree (candidato_id);


--
-- Name: idx_empresa; Type: INDEX; Schema: schema_postulaciones; Owner: -
--

CREATE INDEX idx_empresa ON public.postulaciones USING btree (empresa_id);


--
-- Name: idx_entrevista_postulacion; Type: INDEX; Schema: schema_postulaciones; Owner: -
--

CREATE INDEX idx_entrevista_postulacion ON public.entrevistas USING btree (postulacion_id);


--
-- Name: idx_estado; Type: INDEX; Schema: schema_postulaciones; Owner: -
--

CREATE INDEX idx_estado ON public.postulaciones USING btree (estado);


--
-- Name: idx_evaluacion_postulacion; Type: INDEX; Schema: schema_postulaciones; Owner: -
--

CREATE INDEX idx_evaluacion_postulacion ON public.evaluaciones USING btree (postulacion_id);


--
-- Name: idx_historial_postulacion; Type: INDEX; Schema: schema_postulaciones; Owner: -
--

CREATE INDEX idx_historial_postulacion ON public.historial_postulaciones USING btree (postulacion_id);


--
-- Name: idx_oferta; Type: INDEX; Schema: schema_postulaciones; Owner: -
--

CREATE INDEX idx_oferta ON public.postulaciones USING btree (oferta_id);


--
-- Name: requisitos_oferta fk3mwatkv8lfmn9te7t9ew5pmlx; Type: FK CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.requisitos_oferta
    ADD CONSTRAINT fk3mwatkv8lfmn9te7t9ew5pmlx FOREIGN KEY (oferta_id) REFERENCES public.ofertas(id);


--
-- Name: ofertas_habilidades fk46nul52rtmk4wj2fs890ms2gq; Type: FK CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.ofertas_habilidades
    ADD CONSTRAINT fk46nul52rtmk4wj2fs890ms2gq FOREIGN KEY (oferta_id) REFERENCES public.ofertas(id);


--
-- Name: ofertas_habilidades fkicy9269b8400283xyou47bghv; Type: FK CONSTRAINT; Schema: schema_ofertas; Owner: -
--

ALTER TABLE ONLY public.ofertas_habilidades
    ADD CONSTRAINT fkicy9269b8400283xyou47bghv FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(id);


--
-- Name: ofertas_habilidades fk46nul52rtmk4wj2fs890ms2gq; Type: FK CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.ofertas_habilidades_postulaciones_legacy
    ADD CONSTRAINT fk46nul52rtmk4wj2fs890ms2gq FOREIGN KEY (oferta_id) REFERENCES public.ofertas(id);


--
-- Name: historial_postulaciones fkc9daa08u3c25tovn5b1csw524; Type: FK CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.historial_postulaciones
    ADD CONSTRAINT fkc9daa08u3c25tovn5b1csw524 FOREIGN KEY (postulacion_id) REFERENCES public.postulaciones(id);


--
-- Name: evaluaciones fkg1ydwwxuyv8bf2pb218uqks4h; Type: FK CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT fkg1ydwwxuyv8bf2pb218uqks4h FOREIGN KEY (postulacion_id) REFERENCES public.postulaciones(id);


--
-- Name: ofertas_habilidades fkicy9269b8400283xyou47bghv; Type: FK CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.ofertas_habilidades_postulaciones_legacy
    ADD CONSTRAINT fkicy9269b8400283xyou47bghv FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(id);


--
-- Name: entrevistas fkmwr0bkuf3vd2jdjslpqqchxy9; Type: FK CONSTRAINT; Schema: schema_postulaciones; Owner: -
--

ALTER TABLE ONLY public.entrevistas
    ADD CONSTRAINT fkmwr0bkuf3vd2jdjslpqqchxy9 FOREIGN KEY (postulacion_id) REFERENCES public.postulaciones(id);


--
-- Name: sesiones_usuario fk61yesn8vugoenw8jxfsp6atnj; Type: FK CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.sesiones_usuario
    ADD CONSTRAINT fk61yesn8vugoenw8jxfsp6atnj FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: empresas fkk6mwmvrorvupyd4txw2rsfhwt; Type: FK CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT fkk6mwmvrorvupyd4txw2rsfhwt FOREIGN KEY (id) REFERENCES public.usuarios(id);


--
-- Name: administradores fkk8pfcp9y41epaar30iqjcgy6u; Type: FK CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT fkk8pfcp9y41epaar30iqjcgy6u FOREIGN KEY (id) REFERENCES public.usuarios(id);


--
-- Name: email_verification_tokens fkmh13ig68rkev2vrqa5jpngxgl; Type: FK CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT fkmh13ig68rkev2vrqa5jpngxgl FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: perfil_habilidades fknaq0gln0iqj8mf8urq6bxhi4l; Type: FK CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.perfil_habilidades
    ADD CONSTRAINT fknaq0gln0iqj8mf8urq6bxhi4l FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(id);


--
-- Name: password_reset_tokens fkp3log76r68owjybas53j8jaig; Type: FK CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT fkp3log76r68owjybas53j8jaig FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: refresh_tokens fkpdrw1klic7bvvhhkjojwu64t2; Type: FK CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT fkpdrw1klic7bvvhhkjojwu64t2 FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: estudiantes fkqw356c1khw5pmb1dscg1aretj; Type: FK CONSTRAINT; Schema: schema_usuarios; Owner: -
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT fkqw356c1khw5pmb1dscg1aretj FOREIGN KEY (id) REFERENCES public.usuarios(id);


--
-- PostgreSQL database dump complete
--



-- VinculaciÃ³n con Supabase Auth. El usuario debe existir previamente en auth.users.
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS auth_user_id uuid;
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_auth_user_id_key;
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_auth_user_id_key UNIQUE (auth_user_id);
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_auth_user_id_fkey;
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE RESTRICT;
ALTER TABLE public.usuarios ALTER COLUMN auth_user_id SET NOT NULL;

-- Los datos de autenticaciÃ³n ya no pertenecen al esquema de la aplicaciÃ³n.
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS email;
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS password;
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS telefono;
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS email_verificado;
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS telefono_verificado;

-- VerificaciÃ³n final.
SELECT table_schema, table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;





DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = lower('admin@empleapro.local')) THEN
    RAISE EXCEPTION 'Crea primero en Supabase Auth el usuario admin@empleapro.local';
  END IF;
END $$;

INSERT INTO public.usuarios (id, uuid, auth_user_id, activo, bloqueado, rol, estado_cuenta, estado_perfil, porcentaje_completitud, fecha_registro, fecha_actualizacion)
SELECT gen_random_uuid(), gen_random_uuid(), id, true, false, 'ADMINISTRADOR', 'ACTIVA', 'COMPLETO', 100, now(), now()
FROM auth.users
WHERE lower(email) = lower('admin@empleapro.local');

INSERT INTO public.administradores (id)
SELECT u.id FROM public.usuarios u
JOIN auth.users au ON au.id = u.auth_user_id
WHERE lower(au.email) = lower('admin@empleapro.local');

COMMIT;

SELECT u.id, u.auth_user_id, u.rol, au.email
FROM public.usuarios u JOIN auth.users au ON au.id = u.auth_user_id;
