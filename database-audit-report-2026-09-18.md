# Auditoría de base de datos — 2026-09-18

## Resultado ejecutivo

Se inspeccionó la base `db_empleabilidad` mediante JDBC y `pg_dump`, además del código Java/TypeScript del proyecto.

- Base conectada: PostgreSQL local, `db_empleabilidad`.
- Schemas de aplicación: `schema_usuarios`, `schema_ofertas`, `schema_postulaciones`.
- Tablas encontradas: 34.
- Vistas, funciones o triggers de aplicación: no se encontraron en el dump de la base.
- Scripts SQL/migraciones versionados en el repositorio: no existen.
- Configuración actual: Hibernate `ddl-auto=update`.
- Backup completo creado antes de cualquier cambio: [db_empleabilidad_pre-auditoria_2026-09-18.dump](backups/db_empleabilidad_pre-auditoria_2026-09-18.dump).
- Cambios destructivos ejecutados: ninguno.

La conclusión conservadora es mantener la estructura actual. No hay una columna que pueda demostrarse segura para eliminar. La única candidata de tabla es una tabla puente duplicada y vacía, pero se deja intacta hasta confirmar que no hay consumidores externos.

## Inventario de tablas

`MANTENER` significa que existe una entidad, relación, repository, servicio, controlador, consulta o función actual que depende de la tabla. Las tablas vacías no se eliminaron automáticamente.

| Tabla | Registros | Función / uso backend | Clasificación | Acción y motivo |
|---|---:|---|---|---|
| `schema_usuarios.usuarios` | 8 | Entidad base `UsuarioBase`; autenticación, perfiles, roles y auditoría | MANTENER | Es núcleo del sistema; conserva `foto_perfil`. |
| `schema_usuarios.estudiantes` | 6 | Entidad `Estudiante`; perfiles de candidatos | MANTENER | Usada por perfil, registro y postulaciones. |
| `schema_usuarios.empresas` | 1 | Entidad `Empresa`; perfiles y ofertas de empresas | MANTENER | Usada por registro, perfil y consultas de ofertas. |
| `schema_usuarios.administradores` | 1 | Entidad `Administrador`; seguridad/bootstrap administrativo | MANTENER | Necesaria para administración. |
| `schema_usuarios.educacion` | 1 | Entidad/repository `Educacion`; perfil académico | MANTENER | Tiene datos y endpoints de perfil. |
| `schema_usuarios.experiencias_laborales` | 1 | Entidad/repository; experiencia del candidato | MANTENER | Tiene datos y endpoints de perfil. |
| `schema_usuarios.perfil_habilidades` | 1 | Entidad/repository; habilidades del candidato | MANTENER | Relaciona usuarios con habilidades. |
| `schema_usuarios.habilidades` | 1 | Catálogo de habilidades de usuario | MANTENER | Referenciada por `PerfilHabilidad`. |
| `schema_usuarios.idiomas` | 0 | Entidad de idiomas del perfil | MANTENER | Vacía, pero preparada y mapeada por backend. |
| `schema_usuarios.certificaciones` | 0 | Entidad de certificaciones del perfil | MANTENER | Vacía, pero preparada y mapeada por backend. |
| `schema_usuarios.proyectos` | 0 | Entidad de proyectos del perfil | MANTENER | Vacía, pero preparada y mapeada por backend. |
| `schema_usuarios.preferencias_laborales` | 0 | Entidad de preferencias de búsqueda | MANTENER | Vacía, pero preparada y mapeada por backend. |
| `schema_usuarios.documentos_cv` | 0 | Entidad de CV almacenado; `StorageService`/CV | MANTENER | Vacía, pero funcionalidad de CV activa. |
| `schema_usuarios.email_verification_tokens` | 0 | Verificación de correo | MANTENER | Token de proceso de autenticación. |
| `schema_usuarios.password_reset_tokens` | 0 | Recuperación de contraseña | MANTENER | Token de proceso de autenticación. |
| `schema_usuarios.refresh_tokens` | 0 | Renovación/revocación de sesión JWT | MANTENER | Token de seguridad. |
| `schema_usuarios.sesiones_usuario` | 0 | Sesiones activas del usuario | MANTENER | Entidad y repository de seguridad. |
| `schema_usuarios.auditoria_usuarios` | 0 | Auditoría de acciones de usuarios | MANTENER | Registro operacional, aunque hoy esté vacío. |
| `schema_usuarios.configuraciones_admin` | 0 | Configuración persistente del panel admin | MANTENER | Entidad/repository y endpoint administrativo. |
| `schema_ofertas.ofertas` | 7 | Entidad `Oferta`; CRUD, publicación y búsqueda | MANTENER | Tiene datos, índices y endpoints activos. |
| `schema_ofertas.categorias_oferta` | 10 | Catálogo y endpoints de categorías | MANTENER | Tiene datos y relación con ofertas. |
| `schema_ofertas.habilidades` | 0 | Habilidades requeridas por ofertas | MANTENER | Relación Many-to-Many activa, aunque vacía. |
| `schema_ofertas.ofertas_habilidades` | 0 | Tabla puente de `Oferta`–habilidad | MANTENER | Mapeada explícitamente por `Oferta`. |
| `schema_ofertas.requisitos_oferta` | 0 | Requisitos asociados a ofertas | MANTENER | Entidad relacionada con `Oferta`; no borrar por estar vacía. |
| `schema_ofertas.auditoria_ofertas` | 28 | Auditoría de cambios en ofertas | MANTENER | Tiene datos y entidad activa. |
| `schema_postulaciones.postulaciones` | 2 | Postulaciones, estados y evaluación IA | MANTENER | Tiene datos y múltiples endpoints. |
| `schema_postulaciones.historial_postulaciones` | 6 | Historial de estados de postulaciones | MANTENER | Tiene datos y FK a postulaciones. |
| `schema_postulaciones.entrevistas` | 2 | Entrevistas de postulaciones | MANTENER | Tiene datos y endpoints activos. |
| `schema_postulaciones.evaluaciones` | 3 | Evaluaciones de postulaciones | MANTENER | Tiene datos y endpoints activos. |
| `schema_postulaciones.auditoria_postulaciones` | 57 | Auditoría de postulaciones | MANTENER | Tiene datos y entidad activa. |
| `schema_postulaciones.ofertas_habilidades` | 0 | Tabla puente duplicada en otro schema | POSIBLEMENTE NO UTILIZADO | No aparece en entidades/queries actuales, pero tiene PK/FKs. Requiere revisar logs, consumidores externos y versiones antiguas antes de proponer `DROP TABLE`. |

## Revisión de columnas

No se identificaron columnas candidatas a eliminación segura. En las tablas con entidades, las columnas de la base corresponden a campos Java, incluidos campos heredados de `UsuarioBase` y campos internos `id`/`uuid` usados por las entidades de postulaciones, entrevistas y evaluaciones.

| Tabla / columna candidata | ¿Tiene datos? | ¿Backend la utiliza? | Acción recomendada | Motivo |
|---|---:|---|---|---|
| `schema_usuarios.usuarios.foto_perfil` | Puede contener datos | Sí, perfil/usuario | MANTENER | La instrucción exige conservar fotos de perfil; además está mapeada en `UsuarioBase`. |
| Columnas de `schema_postulaciones.ofertas_habilidades` | No | No se hallaron referencias en código | POSIBLEMENTE NO UTILIZADO | Es una tabla completa duplicada, no una columna aislada; hay que confirmar consumidores externos antes de borrar. |
| Resto de columnas mapeadas | Mixto | Sí o preparadas para uso | MANTENER | No existe evidencia suficiente para demostrar que sean prescindibles. |

## Relaciones, claves, índices y constraints

- Las PK están presentes en las tablas de aplicación.
- Las FKs conservan relaciones de requisitos, habilidades, perfiles, postulaciones, entrevistas, evaluaciones, historial y tokens.
- Los índices declarados por el backend están presentes: búsquedas de ofertas y postulaciones, además de índices de relaciones.
- Los `UNIQUE` de UUID, emails, RUC, catálogos y tokens son funcionalmente necesarios.
- Los `CHECK` de estados, modalidad, jornada, contrato, recomendación y tipos protegen los valores usados por los enums Java.
- El dump no mostró triggers, vistas ni funciones de aplicación que puedan quedar huérfanos.

## Verificación del backend

- `mvnw.cmd -o -DskipTests compile`: correcto.
- El backend conectó a PostgreSQL, creó el pool Hikari, inicializó Hibernate/JPA y el `EntityManagerFactory` sin errores de tablas o columnas inexistentes.
- La segunda instancia no pudo escuchar en `8081` porque ya había una instancia del backend ejecutándose; no se detuvo ese proceso.
- Se levantó una instancia temporal en `8082`; inició completamente y se detuvo al terminar las comprobaciones.
- La instancia existente respondió correctamente:
  - `/v3/api-docs`: HTTP 200.
  - `/swagger-ui/index.html`: HTTP 200.
  - `/api/ofertas`: HTTP 200.
  - `/api/postulaciones`: HTTP 401, comportamiento esperado sin autenticación.
- La instancia temporal en `8082` respondió con los mismos resultados: OpenAPI y `/api/ofertas` HTTP 200, y `/api/postulaciones` HTTP 401.

## Decisión

No se ejecutaron eliminaciones ni modificaciones estructurales. Con la evidencia disponible, eliminar cualquier tabla o columna tendría un riesgo no justificado. El único seguimiento recomendado es investigar `schema_postulaciones.ofertas_habilidades` con logs de acceso/consumidores externos y, si se confirma que no se usa, preparar una migración revisable después de otro backup.
