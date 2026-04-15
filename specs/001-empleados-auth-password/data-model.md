# Data Model - Autenticacion por Empleado

## Entity: Empleado

- Description: Entidad de negocio e identidad para autenticacion Basic Auth.
- Table: `empleados`
- Primary Key:
  - `clave` (string, pattern `^E[0-9]+$`, unique, not null)
- Fields:
  - `clave`: `varchar(32)`, autogenerada por sistema
  - `nombre`: `varchar(100)`, requerido, login case-insensitive
  - `contrasena`: `varchar(100+)`, requerido, hash BCrypt
  - `direccion`: `varchar(100)`, requerido
  - `telefono`: `varchar(100)`, requerido
  - `departamento_clave`: `varchar(32)`, requerido, FK a `departamentos.clave`
- Relationships:
  - Many-to-one hacia `Departamento`
- Validation Rules:
  - `nombre` no vacio, maximo 100, normalizado a minusculas
  - `nombre` unico bajo comparacion case-insensitive
  - `contrasena` obligatoria con politica minima (8+, letra y numero) antes de hashear
  - `departamento_clave` requerido y existente
- State Transitions:
  - `CREATED`: empleado registrado con contrasena valida hasheada
  - `AUTHENTICATED`: acceso autorizado con `nombre` + contrasena correcta
  - `PASSWORD_UPDATED`: contrasena reemplazada y valor anterior deja de autenticar
  - `DELETED`: eliminacion fisica por clave

## Entity: CredencialAutenticacion

- Description: Objeto de validacion de credenciales para SecurityProvider.
- Persistence: no persistente como tabla dedicada en este alcance.
- Fields:
  - `nombre`: login ingresado por cliente (normalizado)
  - `contrasenaPlano`: secreto temporal para comparacion BCrypt
- Validation Rules:
  - `nombre` y `contrasenaPlano` obligatorios
  - no registrar valor plano en logs ni respuestas

## Derived API Projections

## Projection: CreateEmpleadoRequest / UpdateEmpleadoRequest

- `nombre`
- `contrasena` (valor en texto de entrada, nunca expuesto en salida)
- `direccion`
- `telefono`
- `departamentoClave`

## Projection: EmpleadoResponse

- `clave`
- `nombre`
- `direccion`
- `telefono`
- `departamentoClave`
- `contrasena` no se expone
