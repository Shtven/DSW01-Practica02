CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE empleados
    ADD COLUMN IF NOT EXISTS correo VARCHAR(254);

UPDATE empleados
SET correo = lower(trim(clave)) || '@local.invalid'
WHERE correo IS NULL
   OR btrim(correo) = '';

UPDATE empleados
SET correo = lower(trim(correo))
WHERE correo IS NOT NULL;

UPDATE empleados
SET correo = '${bootstrap_admin_email}'
WHERE clave = 'E0';

UPDATE empleados
SET contrasena = crypt('${bootstrap_admin_password}', gen_salt('bf'))
WHERE clave = 'E0';

ALTER TABLE empleados
    ALTER COLUMN correo SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_empleados_correo_ci
    ON empleados ((lower(correo)));
