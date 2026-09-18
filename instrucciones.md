# Prompt: Migración de base de datos a Supabase

Quiero migrar mi base de datos de PostgreSQL local a Supabase (nube). Antes de generar cualquier script SQL, necesito que analices mi backend a detalle (entidades, repositories, servicios, controladores y relaciones JPA/Hibernate) en los tres schemas actuales: `schema_usuarios`, `schema_ofertas` y `schema_postulaciones` (34 tablas en total).

## Contexto actual

- El backend usa Hibernate con `ddl-auto=update`, por lo que hoy las tablas y relaciones se crean automáticamente al arrancar contra Postgres local.
- Adjunto un reporte de auditoría (`database-audit-report-2026-09-18.md`) con el inventario completo de tablas, columnas, relaciones, claves e índices actuales — úsalo como base para no perder ninguna tabla ni relación en la migración.

## Cambio principal que quiero

- Actualmente la tabla de usuarios tiene columnas de `email`, `contraseña` y `número de teléfono`. Quiero eliminar esos campos de mis tablas propias y reemplazar la autenticación por **Supabase Auth** (usando su sistema de email/contraseña y teléfono nativo), en lugar de manejar credenciales dentro de mi base de datos.
- Necesito que definas cómo enlazar el `id`/`uuid` de `auth.users` de Supabase con mi tabla `usuarios` (y por herencia con `estudiantes`, `empresas`, `administradores`), manteniendo la separación de roles que ya tengo.
- **Importante:** este cambio de autenticación afecta solo a la parte de credenciales. El resto de las ~34 tablas (ofertas, postulaciones, entrevistas, evaluaciones, auditorías, catálogos, etc.) debe mantenerse funcionalmente igual — no quiero que asumas cambios en tablas que no tienen que ver con autenticación sin antes analizarlas.

## Entregables que necesito

1. Un plan de migración explicando qué tablas/columnas cambian, cuáles no, y por qué.
2. Un script SQL completo para Supabase que recree la estructura (schemas, tablas, PKs, FKs, índices, constraints `CHECK`, `UNIQUE`) sin las columnas de email/contraseña/teléfono en las tablas que pasan a depender de `auth.users`.
3. Indicaciones de los cambios necesarios en el backend (Spring Security, entidades JPA, DTOs, servicios de autenticación) para dejar de manejar credenciales localmente y validar contra Supabase Auth (JWT).
4. Antes de ejecutar nada contra datos reales: generar el script en modo "revisión", sin aplicarlo directamente, y recomendar backup previo.

## Nota final

Trabaja de forma conservadora: si una tabla o relación no tiene evidencia clara en el código de que ya no se usa, no la elimines ni la modifiques sin señalarlo primero.