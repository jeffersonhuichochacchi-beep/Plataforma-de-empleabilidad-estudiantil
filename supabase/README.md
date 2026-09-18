# Migración a Supabase Auth (revisión)

El archivo principal para una instalación nueva es `supabase_complete.sql`; contiene estructura y los datos del backup auditado. `supabase_schema.sql` contiene solo estructura y `supabase_data.sql` solo datos. No se ejecutó ningún SQL ni se conectó a Supabase.

Orden recomendado:

1. Crear un proyecto Supabase y configurar Auth con email/password y teléfono.
2. Hacer un backup nuevo de la base local y probar primero en un proyecto Supabase de staging.
3. Crear en Authentication las 8 cuentas existentes usando los correos del backup y las contraseñas nuevas que definas. El script no puede recuperar las contraseñas BCrypt antiguas.
4. Ejecutar `supabase_complete.sql` en el SQL Editor. El bloque de datos se detiene si faltan esas cuentas Auth.
5. Configurar las variables del backend indicadas en `application.properties`, iniciar y validar conteos, FKs, login y autorización por rol.

El script de estructura sí está listo para ejecutar en el SQL Editor. No contiene contraseñas ni inserta filas en `auth.users`; las credenciales se gestionan exclusivamente desde Supabase Auth.

La tabla propia conserva `usuarios.id` para no romper las relaciones existentes. `usuarios.auth_user_id` es la referencia única a `auth.users.id`; email, password, teléfono y los flags locales de verificación dejan de almacenarse en las tablas propias. Las dos tablas duplicadas `habilidades` se unifican porque tienen la misma estructura; la tabla puente no utilizada se conserva como `public.ofertas_habilidades_postulaciones_legacy`.
