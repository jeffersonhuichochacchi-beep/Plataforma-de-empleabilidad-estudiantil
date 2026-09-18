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







-- Datos del backup auditado. Crear primero las cuentas correspondientes en Supabase Auth.
BEGIN;
INSERT INTO public.usuarios (id, auth_user_id, activo, bloqueado, estado_cuenta, estado_perfil, fecha_actualizacion, fecha_eliminacion, fecha_registro, foto_perfil, porcentaje_completitud, rol, ultimo_acceso, uuid) SELECT '268a315a-9b3d-4655-b884-8ddeb532cd9d', au.id, 't', 'f', 'PENDIENTE_VERIFICACION', 'INCOMPLETO', '2026-09-03 14:03:35.791609', NULL, '2026-09-03 14:03:35.791609', NULL, '0', 'ESTUDIANTE', NULL, '299dce2c-7cee-4f62-987b-22ac7fd559f7' FROM auth.users au WHERE lower(au.email)=lower('leocrispaitan@gmail.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.usuarios (id, auth_user_id, activo, bloqueado, estado_cuenta, estado_perfil, fecha_actualizacion, fecha_eliminacion, fecha_registro, foto_perfil, porcentaje_completitud, rol, ultimo_acceso, uuid) SELECT '714f8e1e-b1d2-481e-90ae-afbb0982ab71', au.id, 't', 'f', 'PENDIENTE_VERIFICACION', 'INCOMPLETO', '2026-09-03 14:39:44.204219', NULL, '2026-09-03 14:39:44.206388', NULL, '0', 'ESTUDIANTE', NULL, '138a41fd-c924-4eef-88b6-637c6de6fdc5' FROM auth.users au WHERE lower(au.email)=lower('juan@gmail.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.usuarios (id, auth_user_id, activo, bloqueado, estado_cuenta, estado_perfil, fecha_actualizacion, fecha_eliminacion, fecha_registro, foto_perfil, porcentaje_completitud, rol, ultimo_acceso, uuid) SELECT '0060c667-c907-42b1-bddc-36b6a18d036a', au.id, 't', 'f', 'PENDIENTE_VERIFICACION', 'INCOMPLETO', '2026-09-03 14:42:42.19483', NULL, '2026-09-03 14:42:42.19483', NULL, '0', 'ESTUDIANTE', NULL, '7be95574-d8de-42f3-acc0-053599b70a9e' FROM auth.users au WHERE lower(au.email)=lower('jeffer@gmail.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.usuarios (id, auth_user_id, activo, bloqueado, estado_cuenta, estado_perfil, fecha_actualizacion, fecha_eliminacion, fecha_registro, foto_perfil, porcentaje_completitud, rol, ultimo_acceso, uuid) SELECT '0bd0bfc3-56ee-41cc-bd18-c95793ccee63', au.id, 't', 'f', 'PENDIENTE_VERIFICACION', 'INCOMPLETO', '2026-09-04 23:41:29.968631', NULL, '2026-09-04 23:41:29.968631', NULL, '0', 'ESTUDIANTE', NULL, 'aafd2185-35b5-4eac-a85c-55c957a390bd' FROM auth.users au WHERE lower(au.email)=lower('indira@gmail.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.usuarios (id, auth_user_id, activo, bloqueado, estado_cuenta, estado_perfil, fecha_actualizacion, fecha_eliminacion, fecha_registro, foto_perfil, porcentaje_completitud, rol, ultimo_acceso, uuid) SELECT '65b09f07-9686-485f-be3e-07ae112d07ed', au.id, 't', 'f', 'ACTIVA', 'INCOMPLETO', '2026-09-17 13:05:28.23307', NULL, '2026-09-03 15:35:04.175965', NULL, '83', 'ESTUDIANTE', NULL, 'fd5937a5-6115-4017-9a94-a3ce345ab4b8' FROM auth.users au WHERE lower(au.email)=lower('jeffersonhuichochacchi@gmail.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.usuarios (id, auth_user_id, activo, bloqueado, estado_cuenta, estado_perfil, fecha_actualizacion, fecha_eliminacion, fecha_registro, foto_perfil, porcentaje_completitud, rol, ultimo_acceso, uuid) SELECT 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', au.id, 't', 'f', 'ACTIVA', 'INCOMPLETO', '2026-09-17 13:10:56.657928', NULL, '2026-09-03 17:03:58.246181', NULL, '40', 'EMPRESA', NULL, '169a9266-15e4-4da1-a8d1-11f0f12be148' FROM auth.users au WHERE lower(au.email)=lower('contacto@empresa.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.usuarios (id, auth_user_id, activo, bloqueado, estado_cuenta, estado_perfil, fecha_actualizacion, fecha_eliminacion, fecha_registro, foto_perfil, porcentaje_completitud, rol, ultimo_acceso, uuid) SELECT 'eec08e1e-872f-4aaa-bda0-bc966a43013c', au.id, 't', 'f', 'PENDIENTE_VERIFICACION', 'INCOMPLETO', '2026-09-17 22:08:42.033035', NULL, '2026-09-17 21:47:36.673188', NULL, '33', 'ESTUDIANTE', NULL, '6dbad7e8-0b92-4d24-badc-b0bddf845dfe' FROM auth.users au WHERE lower(au.email)=lower('Jose@gmail.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.usuarios (id, auth_user_id, activo, bloqueado, estado_cuenta, estado_perfil, fecha_actualizacion, fecha_eliminacion, fecha_registro, foto_perfil, porcentaje_completitud, rol, ultimo_acceso, uuid) SELECT '13b7c689-e496-4b73-aebf-3e610d73877b', au.id, 't', 'f', 'ACTIVA', 'INCOMPLETO', '2026-09-17 22:51:29.833907', NULL, '2026-09-17 22:51:29.833907', NULL, '0', 'ADMINISTRADOR', NULL, 'b32eda50-4cd6-464f-98d5-906e9e640574' FROM auth.users au WHERE lower(au.email)=lower('admin@empleapro.local') ON CONFLICT (id) DO NOTHING;
DO $$ BEGIN IF (SELECT count(*) FROM public.usuarios WHERE auth_user_id IS NOT NULL) < 8 THEN RAISE EXCEPTION 'Faltan cuentas en auth.users: se esperaban 8'; END IF; END $$;
INSERT INTO public.estudiantes (apellidos, biografia, dni, enlace_portafolio, nombres, titulo_profesional, ubicacion, url_cv_pdf, id) VALUES ('paitan contreras', NULL, '63381113', NULL, 'leonel', NULL, NULL, NULL, '268a315a-9b3d-4655-b884-8ddeb532cd9d') ON CONFLICT DO NOTHING;
INSERT INTO public.estudiantes (apellidos, biografia, dni, enlace_portafolio, nombres, titulo_profesional, ubicacion, url_cv_pdf, id) VALUES ('perez', NULL, '63381112', NULL, 'jose', NULL, NULL, NULL, '714f8e1e-b1d2-481e-90ae-afbb0982ab71') ON CONFLICT DO NOTHING;
INSERT INTO public.estudiantes (apellidos, biografia, dni, enlace_portafolio, nombres, titulo_profesional, ubicacion, url_cv_pdf, id) VALUES ('Huicho Chacchi', NULL, '77012332', NULL, 'Jefferson', NULL, NULL, NULL, '0060c667-c907-42b1-bddc-36b6a18d036a') ON CONFLICT DO NOTHING;
INSERT INTO public.estudiantes (apellidos, biografia, dni, enlace_portafolio, nombres, titulo_profesional, ubicacion, url_cv_pdf, id) VALUES ('HUICHO CHACCHI', NULL, '77017520', NULL, 'INDIRA ANALIT', NULL, NULL, NULL, '0bd0bfc3-56ee-41cc-bd18-c95793ccee63') ON CONFLICT DO NOTHING;
INSERT INTO public.estudiantes (apellidos, biografia, dni, enlace_portafolio, nombres, titulo_profesional, ubicacion, url_cv_pdf, id) VALUES ('HUICHO CHACCHI', '10 aÃƒÂ±os de experencias', '77017521', 'https://res.cloudinary.com/fiprgfpd/raw/upload/v1789072782/cvs_perfiles/cv_65b09f07-9686-485f-be3e-07ae112d07ed_bf42886c-d605-4083-aec5-6ccff1136e55', 'JEFFERSON', 'Inginiero de sistemas', 'Carmen alto', NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.estudiantes (apellidos, biografia, dni, enlace_portafolio, nombres, titulo_profesional, ubicacion, url_cv_pdf, id) VALUES ('LECHE LOPEZ', '', '77017522', NULL, 'YOMER RONALDO', '', '', NULL, 'eec08e1e-872f-4aaa-bda0-bc966a43013c') ON CONFLICT DO NOTHING;
INSERT INTO public.empresas (descripcion, direccion, email_corporativo, estado_verificacion, fecha_verificacion, industria, logo, nombre_comercial, razon_social, ruc, sitio_web, tamano, ubicacion, id, banner_color, beneficios, github_url, linkedin_url, twitter_url) VALUES (NULL, NULL, NULL, 'VERIFICADA', '2026-09-17 13:10:56.655456', NULL, NULL, NULL, 'AGUADO SAUÃƒâ€˜E EDITH KARINA', '10445680660', NULL, NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', NULL, NULL, NULL, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.administradores (id) VALUES ('13b7c689-e496-4b73-aebf-3e610d73877b') ON CONFLICT DO NOTHING;
INSERT INTO public.habilidades (id, activo, descripcion, nombre) VALUES ('e17a0b06-28a1-4e79-b3c5-f7ff341b3639', true, NULL, 'Programacion') ON CONFLICT DO NOTHING;
INSERT INTO public.educacion (id, actual, carrera, descripcion, fecha_fin, fecha_inicio, grado, institucion, usuario_id) VALUES ('3ac39528-cdcb-4784-a054-242972dc96af', 'f', 'Ingeniero de sisitemas', '', NULL, '2026-09-15', '10 ciclo', 'la pontificia ELP', '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.experiencias_laborales (id, actual, cargo, descripcion, empresa, fecha_fin, fecha_inicio, modalidad, ubicacion, usuario_id) VALUES ('ecd8eb6f-b3ed-4db8-89ff-b1acaacee6cf', 'f', 'programador', 'con experencia', 'la pontifica', '2026-09-15', '2026-07-12', '', '', '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('6982324e-9a26-4c22-9634-fd18b5d3f0c1', 't', 'Empleos en el sector de tecnologÃƒÆ’Ã‚Â­a e informÃƒÆ’Ã‚Â¡tica', '2026-09-04 00:24:21.447689+02', '2026-09-04 00:24:21.447689+02', 'TecnologÃƒÆ’Ã‚Â­a') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('57cd0d8d-e1a5-44cd-afed-af26877cf564', 't', 'Empleos en el ÃƒÆ’Ã‚Â¡rea comercial y ventas', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'Ventas') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('d5788c27-0eae-4527-bc83-82fb06636ccb', 't', 'Empleos en marketing y publicidad', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'Marketing') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('b44be5d1-cc9d-41d8-a7b7-a7944c4792c1', 't', 'Empleos en gestiÃƒÆ’Ã‚Â³n de talento y RRHH', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'Recursos Humanos') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('a04f218d-552b-4189-987e-eb9a426ab8ae', 't', 'Empleos en finanzas y contabilidad', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'Finanzas') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('b1b3b330-1a7b-4a92-8883-d24af3a42267', 't', 'Empleos administrativos', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'AdministraciÃƒÆ’Ã‚Â³n') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('7bc49fa6-80ff-4c85-aa8c-560f8125fd14', 't', 'Empleos en logÃƒÆ’Ã‚Â­stica y cadena de suministro', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'LogÃƒÆ’Ã‚Â­stica') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('242e835e-9635-45e1-af06-d1d5178aabde', 't', 'Empleos en el sector salud', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'Salud') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('d98f2256-9549-4803-9f53-11dd02b14b9f', 't', 'Empleos en educaciÃƒÆ’Ã‚Â³n y formaciÃƒÆ’Ã‚Â³n', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'EducaciÃƒÆ’Ã‚Â³n') ON CONFLICT DO NOTHING;
INSERT INTO public.categorias_oferta (id, activo, descripcion, fecha_actualizacion, fecha_creacion, nombre) VALUES ('401c9b62-132a-4e8b-a656-f4deba704092', 't', 'Otras ÃƒÆ’Ã‚Â¡reas profesionales', '2026-09-04 00:24:21.452213+02', '2026-09-04 00:24:21.452213+02', 'Otros') ON CONFLICT DO NOTHING;
INSERT INTO public.ofertas (id, acepta_postulaciones, area_profesional, categoria_id, departamento, descripcion, distrito, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_creacion, fecha_publicacion, fecha_vencimiento, jornada, modalidad, moneda, nivel_experiencia, numero_postulaciones, numero_vistas, pais, provincia, reclutador_id, salario_maximo, salario_minimo, tipo_contrato, titulo, ubicacion) VALUES ('9e4e5fcf-4067-444a-92db-ca143c52a46d', 't', 'TecnologÃƒÂ­a', '6982324e-9a26-4c22-9634-fd18b5d3f0c1', NULL, 'Buscamos un Desarrollador Full Stack apasionado por construir aplicaciones web escalables e intuitivas.

Responsabilidades:

DiseÃƒÂ±ar y desarrollar interfaces de usuario dinÃƒÂ¡micas utilizando React.js y Tailwind CSS.

Implementar APIs RESTful eficientes y seguras con Node.js y Express.

DiseÃƒÂ±ar y optimizar consultas en bases de datos (PostgreSQL/MongoDB).

Colaborar activamente con el equipo de diseÃƒÂ±o y producto.

Beneficios:

Trabajo en modalidad hÃƒÂ­brida con flexibilidad horaria.

Oportunidades de crecimiento profesional y capacitaciones continuas.

Excelente ambiente de trabajo y equipo colaborativo.', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'PUBLICADA', '2026-09-04 00:32:27.349833+02', NULL, '2026-09-04 00:32:27.246024+02', '2026-09-04 00:32:27.329351+02', '2026-10-13 06:59:59+02', 'DIURNA', 'REMOTO', 'PEN', 'EXPERTO', '0', '0', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '40000.00', '2000.00', 'MEDIO_TIEMPO', 'Desarrollador Full Stack React & Node.js', 'Lima, PerÃƒÂº') ON CONFLICT DO NOTHING;
INSERT INTO public.ofertas (id, acepta_postulaciones, area_profesional, categoria_id, departamento, descripcion, distrito, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_creacion, fecha_publicacion, fecha_vencimiento, jornada, modalidad, moneda, nivel_experiencia, numero_postulaciones, numero_vistas, pais, provincia, reclutador_id, salario_maximo, salario_minimo, tipo_contrato, titulo, ubicacion) VALUES ('83d42856-81de-4104-acb3-7450377b81b2', 'f', 'TecnologÃƒÂ­a', '6982324e-9a26-4c22-9634-fd18b5d3f0c1', NULL, 'buen trabajo y buena paga', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'CERRADA', '2026-09-04 18:56:23.516021+02', '2026-09-04 18:56:23.514029+02', '2026-09-04 18:46:56.897403+02', '2026-09-04 18:47:04.069296+02', '2026-09-14 06:59:59+02', 'DIURNA', 'PRESENCIAL', 'PEN', 'PRACTICANTE', '0', '0', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '4000.00', '3000.00', 'TIEMPO_COMPLETO', 'Desarrollador frontend diseÃƒÂ±o', 'Ayacucho, PerÃƒÂº') ON CONFLICT DO NOTHING;
INSERT INTO public.ofertas (id, acepta_postulaciones, area_profesional, categoria_id, departamento, descripcion, distrito, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_creacion, fecha_publicacion, fecha_vencimiento, jornada, modalidad, moneda, nivel_experiencia, numero_postulaciones, numero_vistas, pais, provincia, reclutador_id, salario_maximo, salario_minimo, tipo_contrato, titulo, ubicacion) VALUES ('f9efb09d-1bb8-48fa-8711-52de3a77eec4', 'f', 'TecnologÃƒÂ­a', '6982324e-9a26-4c22-9634-fd18b5d3f0c1', NULL, '111111111111', NULL, '65b09f07-9686-485f-be3e-07ae112d07ed', 'CERRADA', '2026-09-04 19:12:13.575489+02', '2026-09-04 19:12:13.568843+02', '2026-09-04 19:11:46.855008+02', NULL, '2026-09-13 06:59:59+02', 'DIURNA', 'REMOTO', 'PEN', 'EXPERTO', '0', '0', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed', '3000.00', '2000.00', 'MEDIO_TIEMPO', 'Desarrollador frontend diseÃƒÂ±o', 'Lima, PerÃƒÂº') ON CONFLICT DO NOTHING;
INSERT INTO public.ofertas (id, acepta_postulaciones, area_profesional, categoria_id, departamento, descripcion, distrito, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_creacion, fecha_publicacion, fecha_vencimiento, jornada, modalidad, moneda, nivel_experiencia, numero_postulaciones, numero_vistas, pais, provincia, reclutador_id, salario_maximo, salario_minimo, tipo_contrato, titulo, ubicacion) VALUES ('809a3081-5214-4a0a-a6b4-5477214395b3', 'f', 'TecnologÃƒÂ­a', '6982324e-9a26-4c22-9634-fd18b5d3f0c1', NULL, 'trabjo tiempo completo', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'CERRADA', '2026-09-04 19:15:09.942563+02', '2026-09-04 19:15:09.942563+02', '2026-09-04 18:57:25.088435+02', '2026-09-04 18:57:43.295923+02', '2026-09-12 06:59:59+02', 'DIURNA', 'REMOTO', 'PEN', 'EXPERTO', '0', '0', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '6000.00', '3000.00', 'MEDIO_TIEMPO', 'Desarrollador de pagina industrial', 'Lima, PerÃƒÂº') ON CONFLICT DO NOTHING;
INSERT INTO public.ofertas (id, acepta_postulaciones, area_profesional, categoria_id, departamento, descripcion, distrito, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_creacion, fecha_publicacion, fecha_vencimiento, jornada, modalidad, moneda, nivel_experiencia, numero_postulaciones, numero_vistas, pais, provincia, reclutador_id, salario_maximo, salario_minimo, tipo_contrato, titulo, ubicacion) VALUES ('b427be26-678d-454b-a342-f0a078000de7', 'f', 'TecnologÃƒÂ­a', '6982324e-9a26-4c22-9634-fd18b5d3f0c1', NULL, 'Trabajo a tiempo completo  y con experencia y buena paga', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'CERRADA', '2026-09-04 19:15:12.780045+02', '2026-09-04 19:15:12.772134+02', '2026-09-04 18:43:06.602312+02', '2026-09-04 19:14:39.0705+02', '2026-09-12 06:59:59+02', 'DIURNA', 'PRESENCIAL', 'PEN', 'EXPERTO', '0', '0', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '6000.00', '3000.00', 'TIEMPO_COMPLETO', 'Desarrollador backen', 'Ayacucho, PerÃƒÂº') ON CONFLICT DO NOTHING;
INSERT INTO public.ofertas (id, acepta_postulaciones, area_profesional, categoria_id, departamento, descripcion, distrito, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_creacion, fecha_publicacion, fecha_vencimiento, jornada, modalidad, moneda, nivel_experiencia, numero_postulaciones, numero_vistas, pais, provincia, reclutador_id, salario_maximo, salario_minimo, tipo_contrato, titulo, ubicacion) VALUES ('397e2128-c34c-498e-b977-1548d4257ceb', 't', 'TecnologÃƒÂ­a', '6982324e-9a26-4c22-9634-fd18b5d3f0c1', NULL, 'con experencia', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'PUBLICADA', '2026-09-18 05:07:02.965274+02', NULL, '2026-09-18 05:06:07.87657+02', '2026-09-18 05:07:02.960726+02', '2026-09-19 06:59:59+02', 'DIURNA', 'REMOTO', 'PEN', 'EXPERTO', '0', '0', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '4000.00', '2000.00', 'TIEMPO_COMPLETO', 'desarollo de sistemas', 'lima') ON CONFLICT DO NOTHING;
INSERT INTO public.ofertas (id, acepta_postulaciones, area_profesional, categoria_id, departamento, descripcion, distrito, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_creacion, fecha_publicacion, fecha_vencimiento, jornada, modalidad, moneda, nivel_experiencia, numero_postulaciones, numero_vistas, pais, provincia, reclutador_id, salario_maximo, salario_minimo, tipo_contrato, titulo, ubicacion) VALUES ('2c72e7a3-854e-4fcc-bcc3-047200298645', 't', 'TecnologÃƒÂ­a', '6982324e-9a26-4c22-9634-fd18b5d3f0c1', NULL, '99 aÃƒÂ±os de exprencia', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'PUBLICADA', '2026-09-18 06:13:08.626465+02', NULL, '2026-09-18 05:10:07.315297+02', '2026-09-18 06:13:08.466405+02', '2026-10-13 06:59:59+02', 'DIURNA', 'PRESENCIAL', 'PEN', 'JUNIOR', '0', '0', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '4000.00', '2000.00', 'MEDIO_TIEMPO', 'computacion', 'Lima, PerÃƒÂº') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('a266e8ca-c931-46c5-9e46-76f79176d56e', 'OFERTA_CREADA', 'Oferta creada como borrador', '2026-09-04 00:32:27.266818+02', NULL, '9e4e5fcf-4067-444a-92db-ca143c52a46d', 'afd9bc66-35a9-4864-92ba-d09b4bfb7c29', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('ae71ef12-1f74-4835-88bb-b90963d57228', 'OFERTA_PUBLICADA', 'Oferta publicada para recibir postulaciones', '2026-09-04 00:32:27.349833+02', NULL, '9e4e5fcf-4067-444a-92db-ca143c52a46d', 'c7290b92-9483-48ae-86be-fabaf8858c38', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('840775e5-b660-46f3-a57a-7e7d0b902b9b', 'OFERTA_CREADA', 'Oferta creada como borrador', '2026-09-04 18:43:06.616196+02', NULL, 'b427be26-678d-454b-a342-f0a078000de7', '217dc4b0-4ec9-4499-9514-f0c441af4ded', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('5214471d-548f-4062-99be-397652791f0f', 'OFERTA_RECHAZADA', 'Oferta rechazada por administrador', '2026-09-04 18:46:09.712295+02', NULL, 'b427be26-678d-454b-a342-f0a078000de7', 'ebe654c5-d2c7-4f1a-adc5-20c70171c409', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('96b52055-95ee-4e5e-98c5-f7e1c420d7a4', 'OFERTA_CREADA', 'Oferta creada como borrador', '2026-09-04 18:46:56.897403+02', NULL, '83d42856-81de-4104-acb3-7450377b81b2', '807548a8-c5b9-469c-b3da-b30c319596bf', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('dbaa18cb-815c-4a46-bd3d-6b47c79b1991', 'OFERTA_ENVIADA_A_REVISION', 'Oferta enviada a revision del administrador', '2026-09-04 18:46:56.918746+02', NULL, '83d42856-81de-4104-acb3-7450377b81b2', 'caf32e24-8836-46d1-b4c2-8d837ea02c4d', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('d4219672-ff60-4ccd-9a3d-c63a8480511c', 'OFERTA_APROBADA', 'Oferta aprobada por administrador y publicada', '2026-09-04 18:47:04.069296+02', NULL, '83d42856-81de-4104-acb3-7450377b81b2', '3c80bb29-b338-4031-a11c-bb13a6e76cc8', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('c70dab23-826f-4cd6-83ac-aa8a31e8760f', 'OFERTA_ACTUALIZADA', 'Oferta modificada', '2026-09-04 18:56:06.201433+02', NULL, '83d42856-81de-4104-acb3-7450377b81b2', '5c508c85-3a03-4c43-a8c4-890d44b22220', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('95a9a58e-32c5-4b04-acbf-437c81dc3503', 'OFERTA_CERRADA', 'Oferta cerrada definitivamente', '2026-09-04 18:56:23.515025+02', NULL, '83d42856-81de-4104-acb3-7450377b81b2', '020c225d-6420-4a3a-bc5b-f6cde83797f2', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('41ac6539-6dc0-43a1-9976-016c2a8e7ded', 'OFERTA_CREADA', 'Oferta creada como borrador', '2026-09-04 18:57:25.088435+02', NULL, '809a3081-5214-4a0a-a6b4-5477214395b3', 'abadd442-0ca2-4f63-bd99-6c2409922cbd', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('3c1a2a63-d25f-4011-998d-593465ad4d2a', 'OFERTA_ENVIADA_A_REVISION', 'Oferta enviada a revision del administrador', '2026-09-04 18:57:25.102294+02', NULL, '809a3081-5214-4a0a-a6b4-5477214395b3', '7f5c0f66-1097-46af-aaf5-62e2a3b5d475', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('f3cece66-9c88-4a3c-989b-8acc620299e9', 'OFERTA_APROBADA', 'Oferta aprobada por administrador y publicada', '2026-09-04 18:57:43.295922+02', NULL, '809a3081-5214-4a0a-a6b4-5477214395b3', 'a92a816f-8c13-4ec2-956a-ea98c0a92440', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('49fad193-e682-496d-a435-0f325f900622', 'OFERTA_CREADA', 'Oferta creada como borrador', '2026-09-04 19:11:46.887591+02', NULL, 'f9efb09d-1bb8-48fa-8711-52de3a77eec4', 'ea5d0078-8671-4dc3-a6b5-21e59a628e37', '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('253c1d13-27e4-4cdc-910f-fb7a54e84f9f', 'OFERTA_ENVIADA_A_REVISION', 'Oferta enviada a revision del administrador', '2026-09-04 19:11:46.964086+02', NULL, 'f9efb09d-1bb8-48fa-8711-52de3a77eec4', 'f2cdaa17-a6e5-42fc-a877-76d6c24a89aa', '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('d65f17d6-0cd9-4129-84bd-d4f8a25b5786', 'OFERTA_RECHAZADA', 'Oferta rechazada por administrador', '2026-09-04 19:11:58.435756+02', NULL, 'f9efb09d-1bb8-48fa-8711-52de3a77eec4', 'a337aef8-ec7b-4a25-b1a6-236bc7cda12a', '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('e1c8a767-df45-4077-8c69-2eb84a8ce3e0', 'OFERTA_CERRADA', 'Oferta cerrada definitivamente', '2026-09-04 19:12:13.575489+02', NULL, 'f9efb09d-1bb8-48fa-8711-52de3a77eec4', '9c98fe23-7f11-4e56-9fdb-42a2acf68a8a', '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('1460ee13-dc80-4c5b-b0ef-f10acfb17ba4', 'OFERTA_ENVIADA_A_REVISION', 'Oferta enviada a revision del administrador', '2026-09-04 19:14:16.920694+02', NULL, 'b427be26-678d-454b-a342-f0a078000de7', '6be270c8-b0f4-44af-b11f-e561e582c8a3', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('eceb8f22-bacd-473a-bcc2-ad7669a6b787', 'OFERTA_RECHAZADA', 'Oferta rechazada por administrador', '2026-09-04 19:14:28.86238+02', NULL, 'b427be26-678d-454b-a342-f0a078000de7', 'eb98f52f-1f9a-40a1-adba-add60c89e3e5', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('f2c503d5-8c00-4ba3-bbd3-50ea6602a513', 'OFERTA_ENVIADA_A_REVISION', 'Oferta enviada a revision del administrador', '2026-09-04 19:14:32.851288+02', NULL, 'b427be26-678d-454b-a342-f0a078000de7', '3e44c0b9-14be-4eb6-a527-19d8a1d86f4d', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('ca731520-9c52-43d1-88ba-9799d936fce7', 'OFERTA_APROBADA', 'Oferta aprobada por administrador y publicada', '2026-09-04 19:14:39.075059+02', NULL, 'b427be26-678d-454b-a342-f0a078000de7', 'b7713d97-fb0b-46ac-8f9c-258f8def15f3', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('38ac78b0-f533-42ba-b624-f0893297ae14', 'OFERTA_CERRADA', 'Oferta cerrada definitivamente', '2026-09-04 19:15:09.942563+02', NULL, '809a3081-5214-4a0a-a6b4-5477214395b3', '169366bc-88d2-466d-9fdb-cf4a7e8e5c83', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('24ff80c4-b2fd-4338-9034-db7eed7a0cad', 'OFERTA_CERRADA', 'Oferta cerrada definitivamente', '2026-09-04 19:15:12.776957+02', NULL, 'b427be26-678d-454b-a342-f0a078000de7', '1edd8985-bc3e-4286-ac3e-83bc6f105377', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('577f6eea-cb13-480e-9655-e79deea4a60c', 'OFERTA_CREADA', 'Oferta creada como borrador', '2026-09-18 05:06:07.87657+02', NULL, '397e2128-c34c-498e-b977-1548d4257ceb', 'ff7da7fd-d00c-4347-a30a-ecf006304819', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('d9095d1f-1e0d-490f-8ec7-d5e16f21ca9d', 'OFERTA_ENVIADA_A_REVISION', 'Oferta enviada a revision del administrador', '2026-09-18 05:06:07.950674+02', NULL, '397e2128-c34c-498e-b977-1548d4257ceb', '2c2e859a-ea20-40fd-86e3-5eac602ca5a8', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('e037e78a-7060-44a0-908f-d866c187cdf0', 'OFERTA_APROBADA', 'Oferta aprobada por administrador y publicada', '2026-09-18 05:07:02.964722+02', NULL, '397e2128-c34c-498e-b977-1548d4257ceb', 'bfbb16d9-b409-4355-9c05-2862a8e6c545', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('4706a736-6d26-4ef1-94f8-445682508c26', 'OFERTA_CREADA', 'Oferta creada como borrador', '2026-09-18 05:10:07.318347+02', NULL, '2c72e7a3-854e-4fcc-bcc3-047200298645', '50481fb6-27f4-48db-bb26-f1a11ac78a59', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('7b36896a-a4db-4033-9b04-10de763772cf', 'OFERTA_ENVIADA_A_REVISION', 'Oferta enviada a revision del administrador', '2026-09-18 05:10:07.351001+02', NULL, '2c72e7a3-854e-4fcc-bcc3-047200298645', '675e8cd0-7ff5-4b6b-b658-3d251a50a68e', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_ofertas (id, accion, descripcion, fecha, ip, oferta_id, trace_id, usuario_id) VALUES ('f0c83412-cb1e-42e4-b47a-d5351a589b1c', 'OFERTA_APROBADA', 'Oferta aprobada por administrador y publicada', '2026-09-18 06:13:08.573685+02', NULL, '2c72e7a3-854e-4fcc-bcc3-047200298645', '9c10f320-ab81-4e5c-bdd1-155288a0a5e1', '13b7c689-e496-4b73-aebf-3e610d73877b') ON CONFLICT DO NOTHING;
INSERT INTO public.postulaciones (id, candidato_id, carta_presentacion, cv_url, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_postulacion, observaciones, oferta_id, uuid, cumple_requerimientos, habilidades_encontradas, porcentaje_coincidencia, resumen_ia) VALUES ('786237f6-a5e5-4a0b-afec-e9b533c3607e', '65b09f07-9686-485f-be3e-07ae112d07ed', '10 aÃƒÂ±os de experencia', 'https://res.cloudinary.com/fiprgfpd/raw/upload/v1789060529/cvs_postulaciones/indira_9e25ee3c', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'EVALUACION', '2026-09-15 19:20:02.080556', NULL, '2026-09-10 12:15:41.643174', NULL, '9e4e5fcf-4067-444a-92db-ca143c52a46d', '7ea8b823-1712-408c-89ef-664b09638754', NULL, NULL, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.postulaciones (id, candidato_id, carta_presentacion, cv_url, empresa_id, estado, fecha_actualizacion, fecha_cierre, fecha_postulacion, observaciones, oferta_id, uuid, cumple_requerimientos, habilidades_encontradas, porcentaje_coincidencia, resumen_ia) VALUES ('e267efa1-61c6-4574-a837-95e2ad20f03d', 'eec08e1e-872f-4aaa-bda0-bc966a43013c', '11 aÃƒÂ±os de experencia', 'https://res.cloudinary.com/fiprgfpd/raw/upload/v1789700661/cvs_postulaciones/jose_d26f2cdb', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'ENTREVISTA', '2026-09-17 22:07:29.069891', NULL, '2026-09-17 22:04:41.86735', NULL, '9e4e5fcf-4067-444a-92db-ca143c52a46d', '1b90e068-10bc-49d2-9bb4-ec6fdcebeef4', NULL, NULL, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.historial_postulaciones (id, comentario, estado_anterior, estado_nuevo, fecha, usuario_id, postulacion_id) VALUES ('8305f96e-a14b-43dc-b437-d85c6391a6f4', 'Postulacion creada inicialmente', NULL, 'ENVIADA', '2026-09-10 12:15:41.65019', '65b09f07-9686-485f-be3e-07ae112d07ed', '786237f6-a5e5-4a0b-afec-e9b533c3607e') ON CONFLICT DO NOTHING;
INSERT INTO public.historial_postulaciones (id, comentario, estado_anterior, estado_nuevo, fecha, usuario_id, postulacion_id) VALUES ('88ba6e25-b7af-418c-9579-ee9cf7aa4626', NULL, 'ENVIADA', 'EN_REVISION', '2026-09-15 19:07:35.297792', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '786237f6-a5e5-4a0b-afec-e9b533c3607e') ON CONFLICT DO NOTHING;
INSERT INTO public.historial_postulaciones (id, comentario, estado_anterior, estado_nuevo, fecha, usuario_id, postulacion_id) VALUES ('a74fb0af-5d8e-4f33-9744-59f708fa6313', NULL, 'EN_REVISION', 'ENTREVISTA', '2026-09-15 19:07:47.425146', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '786237f6-a5e5-4a0b-afec-e9b533c3607e') ON CONFLICT DO NOTHING;
INSERT INTO public.historial_postulaciones (id, comentario, estado_anterior, estado_nuevo, fecha, usuario_id, postulacion_id) VALUES ('cdf86e27-2152-4ee3-9100-cfcc303a3b7f', 'Evaluacion registrada', 'ENTREVISTA', 'EVALUACION', '2026-09-15 19:20:02.045845', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '786237f6-a5e5-4a0b-afec-e9b533c3607e') ON CONFLICT DO NOTHING;
INSERT INTO public.historial_postulaciones (id, comentario, estado_anterior, estado_nuevo, fecha, usuario_id, postulacion_id) VALUES ('454390e3-7306-4ccc-9304-5da4ec5c84e2', 'Postulacion creada inicialmente', NULL, 'ENVIADA', '2026-09-17 22:04:42.030989', 'eec08e1e-872f-4aaa-bda0-bc966a43013c', 'e267efa1-61c6-4574-a837-95e2ad20f03d') ON CONFLICT DO NOTHING;
INSERT INTO public.historial_postulaciones (id, comentario, estado_anterior, estado_nuevo, fecha, usuario_id, postulacion_id) VALUES ('d172f35f-cd9c-48ab-9b9f-fdefdcd77740', 'expera la entrevista', 'ENVIADA', 'ENTREVISTA', '2026-09-17 22:07:29.058936', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', 'e267efa1-61c6-4574-a837-95e2ad20f03d') ON CONFLICT DO NOTHING;
INSERT INTO public.entrevistas (id, creado_por, duracion, enlace, estado, fecha_actualizacion, fecha_creacion, fecha_hora, observaciones, tipo, ubicacion, uuid, postulacion_id) VALUES ('d5659b90-01fd-4a68-98fb-83c844733201', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '50', 'https://meet.google.com/nir-kzww-sbn?pli=1', 'PROGRAMADA', '2026-09-10 13:35:05.974152', '2026-09-10 12:17:07.224546', '2026-09-21 21:19:00', 'sin falta 10', 'VIRTUAL', NULL, 'ab4ec428-898e-40e3-a6e1-8c4a234d1d23', '786237f6-a5e5-4a0b-afec-e9b533c3607e') ON CONFLICT DO NOTHING;
INSERT INTO public.entrevistas (id, creado_por, duracion, enlace, estado, fecha_actualizacion, fecha_creacion, fecha_hora, observaciones, tipo, ubicacion, uuid, postulacion_id) VALUES ('cc11e84f-3fae-47d8-b170-5f24ead6e257', 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '30', 'httpspss', 'PROGRAMADA', '2026-09-17 22:08:04.233721', '2026-09-17 22:08:04.233721', '2026-10-16 11:11:00', 'sin falta', 'VIRTUAL', NULL, '8dcf3656-3d68-402a-a526-5589dad090e9', 'e267efa1-61c6-4574-a837-95e2ad20f03d') ON CONFLICT DO NOTHING;
INSERT INTO public.evaluaciones (id, comentario, debilidades, evaluador_id, fecha_evaluacion, fortalezas, puntaje, recomendacion, uuid, postulacion_id) VALUES ('170ebd41-3f88-442b-a56c-0e0bde75b962', 'Buen perfil', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '2026-09-15 19:20:01.990256', NULL, '70', 'RECOMENDADO', '50a2fa04-bb2e-41e4-b0c1-4dface58d317', '786237f6-a5e5-4a0b-afec-e9b533c3607e') ON CONFLICT DO NOTHING;
INSERT INTO public.evaluaciones (id, comentario, debilidades, evaluador_id, fecha_evaluacion, fortalezas, puntaje, recomendacion, uuid, postulacion_id) VALUES ('18bd3d12-156e-41ed-9748-83bca9bebcca', 'Buen perfil tÃƒÂ©cnico pero requiere mejorar soft skills', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '2026-09-15 19:21:22.057838', NULL, '75', 'ACEPTABLE', '768d1f42-eff5-4801-a72a-1aa7334bd95e', '786237f6-a5e5-4a0b-afec-e9b533c3607e') ON CONFLICT DO NOTHING;
INSERT INTO public.evaluaciones (id, comentario, debilidades, evaluador_id, fecha_evaluacion, fortalezas, puntaje, recomendacion, uuid, postulacion_id) VALUES ('8ed2e907-a1c2-4fa2-ba89-b0ded9ae3396', 'nada', NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f', '2026-09-15 19:25:55.924011', NULL, '70', 'ACEPTABLE', '15c07ad0-a740-4283-902e-297aa46522ed', '786237f6-a5e5-4a0b-afec-e9b533c3607e') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('2b5dca6e-d65f-42d8-88ff-02064af9e8d1', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 15:16:31.687515', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('e85fd230-18f6-42be-b9ad-c2707c196082', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 16:07:21.073676', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('d04cc30d-f16c-4cf3-94d1-e1138da50a84', 'ESTADO_CAMBIADO', 'Estado de postulacion 102f270d-83e7-420e-a8d2-9084dd3040d7 cambiado a RECHAZADA', '2026-09-04 16:09:46.894103', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('5d31aab9-c049-43f6-92ec-4a2f4ccea8cb', 'ESTADO_CAMBIADO', 'Estado de postulacion 7107cd79-6da2-4f20-bcee-7e74ea5a941c cambiado a ENTREVISTA', '2026-09-04 16:10:07.104856', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('3160ff9c-5c2b-459d-82e5-1f936104bcb3', 'ESTADO_CAMBIADO', 'Estado de postulacion 7107cd79-6da2-4f20-bcee-7e74ea5a941c cambiado a RECHAZADA', '2026-09-04 16:24:03.477765', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('1c5e0059-60b9-49df-8662-9a6b907095c7', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n 7107cd79-6da2-4f20-bcee-7e74ea5a941c eliminada por la empresa', '2026-09-04 16:35:18.018067', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('fe33a471-6dd0-4f1e-ba59-84da3bf08033', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n 102f270d-83e7-420e-a8d2-9084dd3040d7 eliminada por la empresa', '2026-09-04 16:35:27.970211', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('81340bb1-2008-4131-88e0-738daef7e5ba', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 16:36:53.580969', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('d1425f09-aacb-4fb6-95ca-c234fe93c50b', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n e870807b-2440-49b3-98ce-72d8698b03a2 eliminada por la empresa', '2026-09-04 16:37:10.028664', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('39e5496f-b93f-4bba-b588-63d627a40394', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 16:55:51.70789', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('d186ed31-902b-4561-bc3f-d5a54704f48f', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n 9d2ea5c8-ffb1-4229-80a9-5b689629e780 eliminada por la empresa', '2026-09-04 16:56:05.089549', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('c37f2d6f-6d40-43df-87dc-6ea8deaba85b', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 16:56:41.616409', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('5cb313c4-dd3b-4998-b961-4b3a1355b50e', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n ae2227ca-ab4c-48a5-97fb-a2b0904f74f8 eliminada por la empresa', '2026-09-04 16:56:47.931523', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('7c92c78e-f741-4264-831a-5175ac9ad98a', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 17:05:58.154749', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('269ca35b-eb51-4401-a529-b24a4b2ca945', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n 5f9b0670-79f8-4a79-a709-a6b50749c16b eliminada por la empresa', '2026-09-04 17:06:03.70845', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('1b748c0f-a494-4b04-9168-b6a22ffd26e7', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 21:03:00.003825', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('e6a6f970-620b-4a0e-a3a4-353a79c9854c', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n a9dcadbb-ffaa-4a03-98d5-4020864d6bb8 eliminada por la empresa', '2026-09-04 21:03:05.681817', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('abd61df4-0710-4eab-aa85-99cef941b953', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 21:03:59.909471', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('c695f4bb-4e72-4f14-b597-33c009876ee7', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n 1c030893-6219-496b-a39d-f7520f7a4f2f eliminada por la empresa', '2026-09-04 21:05:50.354962', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('a02bed66-c95c-44e7-97dd-8160df22a081', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 21:06:17.62528', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('c2061e5c-4fe9-40e8-a2b7-569a7586da66', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n 6974f816-ff1c-4e80-a66c-c1a8a33b4360 eliminada por la empresa', '2026-09-04 21:19:34.68202', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('b0ee3ea7-a5a1-48f3-a599-5319389903c3', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 21:20:07.685223', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('7d97cc92-70b5-4533-b33c-5ed03fb28bde', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n d1030ccb-7404-4009-903d-8a562a6d29e6 eliminada por la empresa', '2026-09-04 21:21:08.879098', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('c0dabd2b-d21a-46bc-853d-cb456c3232b1', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 21:22:02.707223', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('9905c1a3-5e4c-4338-a7fe-86d7187915a1', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-04 23:42:08.22511', NULL, NULL, '0bd0bfc3-56ee-41cc-bd18-c95793ccee63') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('bdecc6b1-5d3b-46d5-9c37-a9a6dcee7473', 'ESTADO_CAMBIADO', 'Estado de postulacion 55b517cd-03b8-44ee-b560-34e700eff7b7 cambiado a ENTREVISTA', '2026-09-04 23:42:33.707569', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('075b1c92-6413-4822-a949-4c0237eacdf6', 'ESTADO_CAMBIADO', 'Estado de postulacion 55b517cd-03b8-44ee-b560-34e700eff7b7 cambiado a EVALUACION', '2026-09-04 23:48:24.086082', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('827727c6-f725-4e8c-829c-412f0fa97ec6', 'ESTADO_CAMBIADO', 'Estado de postulacion 55b517cd-03b8-44ee-b560-34e700eff7b7 cambiado a SELECCIONADA', '2026-09-04 23:48:39.542124', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('bddd967a-a444-43cb-8586-3c69ab980434', 'EVALUACION_CREADA', 'Evaluacion 8dee4b4b-f30f-4fd4-bbeb-c55a1673f24c creada para postulacion 55b517cd-03b8-44ee-b560-34e700eff7b7', '2026-09-04 23:58:20.646699', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('8aa93eb6-c6e0-4f13-837d-087aafa70158', 'EVALUACION_ACTUALIZADA', 'Evaluacion 8dee4b4b-f30f-4fd4-bbeb-c55a1673f24c actualizada', '2026-09-04 23:59:21.373509', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('665b432b-2716-4b34-a65b-789185ddf229', 'EVALUACION_ACTUALIZADA', 'Evaluacion 8dee4b4b-f30f-4fd4-bbeb-c55a1673f24c actualizada', '2026-09-04 23:59:28.239649', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('2b560122-1b78-499d-a9a3-d270a5bc2f0a', 'EVALUACION_ACTUALIZADA', 'Evaluacion 8dee4b4b-f30f-4fd4-bbeb-c55a1673f24c actualizada', '2026-09-05 00:00:56.02344', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('d6a12d71-4637-495c-a916-5324aecfe75e', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n 55b517cd-03b8-44ee-b560-34e700eff7b7 eliminada por la empresa', '2026-09-09 14:13:43.05559', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('1efbcdf2-dee0-45f7-b8cd-37453ded85a9', 'ESTADO_CAMBIADO', 'Estado de postulacion 47506b7f-6038-4a8a-88fe-925b9a3c22ab cambiado a ENTREVISTA', '2026-09-10 11:39:34.940108', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('037922c8-7733-4e29-8d8e-bad9fd927b04', 'ENTREVISTA_CREADA', 'Entrevista 0d895fe6-1e5c-4c8e-8b4f-8818fbd5ab08 programada para postulacion 47506b7f-6038-4a8a-88fe-925b9a3c22ab', '2026-09-10 11:43:25.164955', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('c8c802d2-11ee-4b89-b853-0eddf93d4ca4', 'POSTULACION_ELIMINADA', 'PostulaciÃƒÂ³n 47506b7f-6038-4a8a-88fe-925b9a3c22ab eliminada por la empresa', '2026-09-10 12:13:59.976829', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('4b9c2e75-8edf-433c-9151-9ae883c41c98', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-10 12:15:41.653554', NULL, NULL, '65b09f07-9686-485f-be3e-07ae112d07ed') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('08469ff2-49dd-4928-b497-25498fec5a48', 'ENTREVISTA_CREADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 programada para postulacion 7ea8b823-1712-408c-89ef-664b09638754', '2026-09-10 12:17:07.229042', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('3841dcdd-d932-4eae-bf8e-fc61091697e6', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 12:44:58.152527', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('5823b457-7c17-4e4c-ac2d-91becfc46160', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 12:45:52.994736', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('2890deea-9093-4a6b-979c-5467c049f29e', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 12:54:50.354733', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('dc9eeb4b-c24d-49c0-b676-7a9df44d1346', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 13:03:55.307199', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('188c6fce-120e-4825-ab7d-a4d7603f8192', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 13:10:21.180506', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('dcb4e828-7d59-4ea4-95b7-ed5cc737b55f', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 13:13:13.92057', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('21c64aba-05b0-4ca9-a896-d8b44fac529d', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 13:18:47.120263', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('b41d4541-a2ef-4535-afc0-ab03751bf5d7', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 13:25:09.162981', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('18a19959-5cea-4980-86b4-63b52cf0c718', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 13:25:40.156028', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('47b1a81b-5e3c-4c07-91a0-5fc39aa82e68', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 13:26:12.124386', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('01606e3f-c75e-4dec-98f0-fcb9ef83d54a', 'ENTREVISTA_REPROGRAMADA', 'Entrevista ab4ec428-898e-40e3-a6e1-8c4a234d1d23 reprogramada', '2026-09-10 13:35:05.956705', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('d7b72d7b-9987-404c-8d8a-069bd4f60754', 'ESTADO_CAMBIADO', 'Estado de postulacion 7ea8b823-1712-408c-89ef-664b09638754 cambiado a EN_REVISION', '2026-09-15 19:07:35.351152', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('d0ff8de7-9dfb-47ac-be25-246062d5911a', 'ESTADO_CAMBIADO', 'Estado de postulacion 7ea8b823-1712-408c-89ef-664b09638754 cambiado a ENTREVISTA', '2026-09-15 19:07:47.426917', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('6d27968e-bf09-41af-ad70-977e0ffdfdf9', 'EVALUACION_CREADA', 'Evaluacion 50a2fa04-bb2e-41e4-b0c1-4dface58d317 creada para postulacion 7ea8b823-1712-408c-89ef-664b09638754', '2026-09-15 19:20:02.052679', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('678c61de-178a-4b9e-8b47-40c7c02f716a', 'EVALUACION_CREADA', 'Evaluacion 768d1f42-eff5-4801-a72a-1aa7334bd95e creada para postulacion 7ea8b823-1712-408c-89ef-664b09638754', '2026-09-15 19:21:22.063571', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('61c0f37d-cb5d-4f34-9b67-1e6f88369a07', 'EVALUACION_CREADA', 'Evaluacion 15c07ad0-a740-4283-902e-297aa46522ed creada para postulacion 7ea8b823-1712-408c-89ef-664b09638754', '2026-09-15 19:25:55.962641', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('4dcca64a-93ae-4bb6-9cef-c133cb6b9c0f', 'POSTULACION_CREADA', 'Postulacion creada para oferta 9e4e5fcf-4067-444a-92db-ca143c52a46d', '2026-09-17 22:04:42.042055', NULL, NULL, 'eec08e1e-872f-4aaa-bda0-bc966a43013c') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('18afdfd0-46e9-41d8-bebd-f1a9ac260785', 'ESTADO_CAMBIADO', 'Estado de postulacion 1b90e068-10bc-49d2-9bb4-ec6fdcebeef4 cambiado a ENTREVISTA', '2026-09-17 22:07:29.062939', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
INSERT INTO public.auditoria_postulaciones (id, accion, descripcion, fecha, ip, user_agent, usuario_id) VALUES ('748c6c59-aea9-4f94-8b38-fa146d313fa9', 'ENTREVISTA_CREADA', 'Entrevista 8dcf3656-3d68-402a-a526-5589dad090e9 programada para postulacion 1b90e068-10bc-49d2-9bb4-ec6fdcebeef4', '2026-09-17 22:08:04.233721', NULL, NULL, 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f') ON CONFLICT DO NOTHING;
COMMIT;

