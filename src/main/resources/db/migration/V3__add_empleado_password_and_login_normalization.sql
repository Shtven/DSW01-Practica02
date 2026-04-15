ALTER TABLE empleados
    ADD COLUMN IF NOT EXISTS contrasena VARCHAR(100);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE empleados
SET nombre = lower(trim(nombre))
WHERE nombre IS NOT NULL;

UPDATE empleados
SET contrasena = crypt('Temp1234', gen_salt('bf'))
WHERE contrasena IS NULL
   OR btrim(contrasena) = '';

INSERT INTO departamentos (clave, nombre)
VALUES ('D1', 'General')
ON CONFLICT (clave) DO NOTHING;

INSERT INTO empleados (clave, nombre, contrasena, direccion, telefono, departamento_clave)
VALUES ('E0', 'admin', crypt('Admin1234', gen_salt('bf')), 'Bootstrap', 'N/A', 'D1')
ON CONFLICT (clave) DO NOTHING;

CREATE UNIQUE INDEX IF NOT EXISTS ux_empleados_nombre_ci
    ON empleados ((lower(nombre)));
