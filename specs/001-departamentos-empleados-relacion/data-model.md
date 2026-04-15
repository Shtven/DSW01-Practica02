# Data Model - Gestion de Departamentos Relacionados con Empleados

## Entity: Departamento

- Description: Unidad organizacional que agrupa empleados.
- Table: `departamentos`
- Primary Key:
  - `clave` (string, pattern `^D[0-9]+$`, unique, not null)
- Fields:
  - `clave`: `varchar(32)`, autogenerada por sistema
  - `nombre`: `varchar(100)`, requerido, maximo 100 caracteres
- Relationships:
  - One-to-many con `Empleado` via `Empleado.departamento_clave`
- Validation Rules:
  - `nombre` no vacio
  - `nombre.length <= 100`
  - `clave` no provista por cliente al crear
- State Transitions:
  - `CREATED`: al registrar con nombre valido
  - `UPDATED`: al modificar nombre
  - `DELETED`: permitido solo si no tiene empleados asociados

## Entity: Empleado

- Description: Registro de empleado asociado obligatoriamente a un departamento.
- Table: `empleados`
- Primary Key:
  - `clave` (string, pattern `^E[0-9]+$`, unique, not null)
- Fields:
  - `clave`: `varchar(32)`, autogenerada por sistema
  - `nombre`: `varchar(100)`, requerido
  - `direccion`: `varchar(100)`, requerido
  - `telefono`: `varchar(100)`, requerido
  - `departamento_clave`: `varchar(32)`, requerido, FK a `departamentos.clave`
- Relationships:
  - Many-to-one hacia `Departamento`
- Validation Rules:
  - `nombre`, `direccion`, `telefono` no vacios y maximo 100
  - `departamento_clave` requerido y existente
- State Transitions:
  - `CREATED`: cuando se registra con departamento existente
  - `UPDATED`: cuando cambia informacion editable o departamento
  - `DELETED`: eliminacion fisica por clave

## Derived API Projections

## Projection: DepartamentoResponse

- `clave`
- `nombre`
- `empleados`: lista de claves de empleados (`string[]`)

## Projection: EmpleadoResponse

- `clave`
- `nombre`
- `direccion`
- `telefono`
- `departamentoClave`
