/*
  Ejecutar una sola vez en el proyecto Supabase que usa el backend.
  El backend ya migró las credenciales a Supabase Auth; estas columnas no
  deben seguir siendo NOT NULL en public.usuarios.
*/
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS auth_user_id uuid;

ALTER TABLE public.usuarios
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS password,
  DROP COLUMN IF EXISTS telefono,
  DROP COLUMN IF EXISTS email_verificado,
  DROP COLUMN IF EXISTS telefono_verificado;

ALTER TABLE public.usuarios
  ALTER COLUMN auth_user_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_auth_user_id_uq
  ON public.usuarios (auth_user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'usuarios_auth_user_id_fkey'
      AND conrelid = 'public.usuarios'::regclass
  ) THEN
    ALTER TABLE public.usuarios
      ADD CONSTRAINT usuarios_auth_user_id_fkey
      FOREIGN KEY (auth_user_id) REFERENCES auth.users(id);
  END IF;
END $$;
