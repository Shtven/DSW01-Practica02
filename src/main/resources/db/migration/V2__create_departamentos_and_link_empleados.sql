CREATE SEQUENCE IF NOT EXISTS departamentos_seq START 1 INCREMENT 1;

CREATE TABLE IF NOT EXISTS departamentos (
    clave VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

ALTER TABLE empleados
    ADD COLUMN IF NOT EXISTS departamento_clave VARCHAR(32);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_empleados_departamentos'
    ) THEN
        ALTER TABLE empleados
            ADD CONSTRAINT fk_empleados_departamentos
            FOREIGN KEY (departamento_clave)
            REFERENCES departamentos (clave);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_empleados_departamento_clave
    ON empleados (departamento_clave);