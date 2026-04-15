# Data Model - Autenticacion por Correo de Empleado

## Entity: Empleado

- Description: Entidad de negocio y autenticacion para acceso por correo.
- Table: `empleados`
- Primary Key:
  - `clave` (string, pattern `^E[0-9]+$`, unique, not null)
- Fields:
  - `clave`: `varchar(32)`, autogenerada por secuencia
  - `nombre`: `varchar(100)`, requerido, dato de negocio (no usado para login)
  - `correo`: `varchar(254)`, requerido para autenticacion efectiva, unico case-insensitive
  - `contrasena`: `varchar(100+)`, requerido, hash BCrypt
  - `direccion`: `varchar(100)`, requerido
  - `telefono`: `varchar(100)`, requerido
  - `departamento_clave`: `varchar(32)`, requerido, FK a `departamentos.clave`
- Relationships:
  - Many-to-one hacia `Departamento`
- Validation Rules:
  - `correo` obligatorio, formato valido, normalizado a minusculas + trim
  - `correo` unico por comparacion case-insensitive
  - `contrasena` con politica minima vigente (8+, letra y numero)
  - `departamento_clave` requerido y existente
- State Transitions:
  - `CREATED`: empleado creado con correo real y contrasena valida
  - `MIGRATED_TEMP_EMAIL`: empleado legacy con correo temporal `<clave>@local.invalid`
  - `ACTIVE_EMAIL_LOGIN`: empleado con correo real autenticable
  - `TEMP_EMAIL_BLOCKED`: empleado con correo temporal no autenticable
  - `UPDATED`: empleado modificado (incluye reemplazo de correo)
  - `DELETED`: eliminacion fisica por clave

## Entity: CredencialAcceso

- Description: Credenciales de autenticacion Basic para resolver identidad.
- Persistence: sin tabla dedicada en este alcance.
- Fields:
  - `correo`: identificador de login entregado por cliente
  - `contrasenaPlano`: secreto temporal para comparacion BCrypt
- Validation Rules:
  - `correo` y `contrasenaPlano` obligatorios
  - si `correo` coincide con sufijo `@local.invalid` -> autenticacion bloqueada

## Entity: CuentaAdminBootstrap

- Description: Cuenta administrativa inicial para operacion post-migracion.
- Persistence: se representa en `empleados` con rol/permiso administrativo en capa de seguridad.
- Fields:
  - `correo`: correo real fijo bootstrap (configurable por entorno)
  - `contrasena`: hash BCrypt
  - `estado`: activo
- Validation Rules:
  - correo bootstrap no puede usar dominio temporal `@local.invalid`
  - credenciales en no-local deben externalizarse por configuracion de entorno

## Derived API Projections

## Projection: CreateEmpleadoRequest / UpdateEmpleadoRequest

- `nombre`
- `correo`
- `contrasena`
- `direccion`
- `telefono`
- `departamentoClave`

## Projection: EmpleadoResponse

- `clave`
- `nombre`
- `correo`
- `direccion`
- `telefono`
- `departamentoClave`
- `contrasena` no se expone
