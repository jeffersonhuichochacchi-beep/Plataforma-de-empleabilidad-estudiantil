# Plan de migración PostgreSQL local → Supabase

## Resultado del análisis

Se revisó `database-audit-report-2026-09-18.md`, las 34 tablas y las entidades, repositories, servicios y controladores Java. El backup previo está en `backups/db_empleabilidad_pre-auditoria_2026-09-18.dump`. No se ejecutaron cambios.

La única modificación funcional autorizada por el requerimiento es la autenticación. Se mantiene la estrategia JPA `JOINED`, los identificadores UUID actuales y todas las tablas de perfiles, ofertas, postulaciones, entrevistas, evaluaciones, auditorías y catálogos.

## Cambios

En `schema_usuarios.usuarios`:

- Se agrega `auth_user_id UUID NOT NULL UNIQUE` y se enlaza a `auth.users(id)`.
- Se eliminan `email`, `password`, `telefono`, `email_verificado` y `telefono_verificado`; sus equivalentes viven en Supabase Auth.
- Se conservan `id`, `uuid`, `foto_perfil`, rol, estado, actividad, bloqueo, completitud, perfil y fechas.

Las tablas `estudiantes`, `empresas` y `administradores` siguen siendo tablas hijas de `usuarios`; por tanto heredan el vínculo de autenticación sin duplicarlo. No se eliminan `empresas.email_corporativo` ni otros campos de contacto de negocio: no son credenciales de `UsuarioBase` y el código los usa como información empresarial.

No se modifican las otras 30 tablas. Se conservan constraints, índices, enums/checks y la tabla puente duplicada `schema_postulaciones.ofertas_habilidades` hasta confirmar consumidores externos.

## Cambios aplicados en backend

1. Se añadió `SupabaseAuthClient`: login y registro usan Supabase Auth; las claves se leen por variables de entorno.
2. Se eliminó el JWT local, BCrypt, el filtro local y el sembrado de administrador.
3. Spring Security valida JWT de Supabase y resuelve el rol desde `public.usuarios.auth_user_id`.
4. `UsuarioBase` usa `auth_user_id`; credenciales y teléfono dejaron de ser columnas JPA persistentes.
5. Todas las entidades y consultas fueron unificadas al esquema `public`; `ddl-auto` quedó en `validate`.
6. El frontend actual puede seguir usando sus endpoints `/api/auth/*`: el backend actúa como proxy de Supabase y devuelve el access token de Supabase.
7. Los secretos fueron retirados de `application.properties`; deben definirse mediante variables de entorno.

## Secuencia segura

Backup → staging → crear/mapeo de usuarios Auth → aplicar SQL revisado → validar conteos y relaciones → desplegar backend compatible → migrar frontend → smoke tests → producción. No eliminar columnas en producción hasta que no existan referencias en código, datos ni procesos externos.
