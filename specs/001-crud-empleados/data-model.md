# Data Model - CRUD de Empleados

## Entidad: Empleado

Descripción: Registro de empleado administrado por el servicio CRUD.

### Campos

- `clave` (varchar(32), PK, not null): identificador único generado por el sistema con formato `E` + secuencia numérica (`E1`, `E2`, ...).
- `nombre` (varchar(100), not null): nombre del empleado.
- `direccion` (varchar(100), not null): dirección del empleado.
- `telefono` (varchar(100), not null): teléfono de contacto del empleado.

### Reglas de validación

- `nombre` debe tener longitud entre 1 y 100 caracteres (sin considerar espacios extremos).
- `direccion` debe tener longitud entre 1 y 100 caracteres (sin considerar espacios extremos).
- `telefono` debe tener longitud entre 1 y 100 caracteres (sin considerar espacios extremos).
- En creación, el cliente no puede enviar `clave`; debe ser autogenerada con prefijo `E` y secuencia.
- En operaciones por identificador, `clave` debe cumplir el patrón `^E[0-9]+$`.
- En actualización, `clave` es inmutable.

### Índices y restricciones

- Primary Key: `clave`.
- Recomendado: índice btree por `clave` (implícito por PK).

### Relaciones

- No hay relaciones externas en esta versión.

### Transiciones de estado

- `NoExiste -> Activo` (creación exitosa).
- `Activo -> Activo` (actualización de atributos permitidos).
- `Activo -> NoExiste` (eliminación física).
