# Data Model - Front Angular Consume API REST

## Entity: SesionUI

- Description: Estado de autenticacion del usuario en la SPA para acceso a rutas protegidas.
- Fields:
  - `isAuthenticated`: boolean
  - `username`: string (correo admin autenticado)
  - `authHeader`: string en memoria para solicitudes HTTP
  - `lastAuthError`: string opcional
- Validation Rules:
  - `authHeader` solo existe durante sesion activa.
  - al cerrar sesion/pestana, el estado debe reiniciarse.
- State Transitions:
  - `UNAUTHENTICATED` -> `AUTHENTICATING` -> `AUTHENTICATED`
  - `AUTHENTICATING` -> `AUTH_FAILED`
  - `AUTHENTICATED` -> `UNAUTHENTICATED` (logout/expiracion)

## Entity: EmpleadoView

- Description: Proyeccion de empleado para listados y formularios CRUD.
- Fields:
  - `clave`: string (`E+digitos`)
  - `nombre`: string
  - `correo`: string
  - `direccion`: string
  - `telefono`: string
  - `departamentoClave`: string (`D+digitos`)
- Validation Rules:
  - `correo` formato valido y unico (segun respuesta backend).
  - `contrasena` requerida en create/update segun politica backend.
  - `departamentoClave` obligatorio y existente.
- State Transitions:
  - `FORM_IDLE` -> `FORM_SUBMITTING` -> `FORM_SUCCESS|FORM_ERROR`

## Entity: DepartamentoView

- Description: Proyeccion de departamento y relacion con empleados.
- Fields:
  - `clave`: string (`D+digitos`)
  - `nombre`: string
  - `empleados`: string[] (claves de empleados)
- Validation Rules:
  - `nombre` no vacio, maximo 100 caracteres.
  - eliminar solo cuando backend lo permite (sin empleados asociados).
- State Transitions:
  - `LIST_LOADING` -> `LIST_READY|LIST_EMPTY|LIST_ERROR`

## Entity: ApiErrorView

- Description: Normalizacion de errores API para presentacion consistente.
- Fields:
  - `status`: number
  - `code`: string opcional
  - `message`: string legible para usuario
  - `path`: string opcional
- Validation Rules:
  - Mensajes no deben incluir detalles internos sensibles.
  - Errores 401/403 deben activar flujo de autenticacion/autorizacion.

## Derived UI Projections

## Projection: EmpleadoListItem

- `clave`
- `nombre`
- `correo`
- `departamentoClave`

## Projection: DepartamentoListItem

- `clave`
- `nombre`
- `empleadosCount` (derivado de `empleados.length`)

## Projection: RequestState

- `loading`
- `error`
- `lastUpdatedAt`