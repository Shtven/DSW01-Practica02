# Feature Specification: Autenticacion por Correo de Empleado

**Feature Branch**: `001-empleados-email-auth`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "cambia la autentificacion para que ahora sea mediante correo y contrasena cambiando la entidad empleado para agregar el campo correo"

## Clarifications

### Session 2026-03-11

- Q: Como migrar empleados existentes sin `correo` al nuevo login por correo? -> A: Backfill determinista con `<clave>@local.invalid`, exigir cambio posterior por API y mantener servicio activo.
- Q: Los correos temporales `<clave>@local.invalid` pueden autenticarse? -> A: No, deben bloquearse para login hasta reemplazo por correo real.
- Q: Quien puede actualizar correo temporal a correo real? -> A: Solo administrador autenticado.
- Q: Como evitar lockout al iniciar con cuentas temporales bloqueadas? -> A: Mantener cuenta admin bootstrap con correo real fijo configurable por entorno.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Iniciar Sesion con Correo (Priority: P1)

Como empleado, quiero iniciar sesion con mi correo y contrasena para acceder a los endpoints protegidos.

**Why this priority**: Es el objetivo principal del cambio y condiciona todo acceso al sistema.

**Independent Test**: Crear un empleado con correo y contrasena validos, autenticar contra un endpoint protegido usando `correo:contrasena` y validar `200`; repetir con contrasena incorrecta y validar `401`.

**Acceptance Scenarios**:

1. **Given** un empleado existente con correo y contrasena validos, **When** envia credenciales Basic Auth correctas, **Then** el sistema autoriza el acceso.
2. **Given** un empleado existente, **When** envia una contrasena incorrecta, **Then** el sistema rechaza el acceso sin filtrar detalles internos.

---

### User Story 2 - Gestionar Correo en Empleados (Priority: P2)

Como administrador, quiero registrar y actualizar el correo de cada empleado para sostener la autenticacion por correo.

**Why this priority**: Sin correo confiable y unico por empleado, el esquema de autenticacion no es viable.

**Independent Test**: Crear empleado con correo valido, actualizar correo y validar que el login solo funciona con el correo vigente.

**Acceptance Scenarios**:

1. **Given** un alta de empleado con correo valido y unico, **When** se guarda correctamente, **Then** el empleado queda autenticable con ese correo.
2. **Given** un empleado existente, **When** se cambia su correo por otro valido y unico, **Then** el login con correo anterior deja de funcionar y el nuevo funciona.

---

### User Story 3 - Mantener Continuidad Operativa (Priority: P3)

Como administrador del sistema, quiero mantener los flujos CRUD actuales de empleados y departamentos tras la migracion de login para evitar regresiones.

**Why this priority**: Permite introducir el cambio de identidad sin romper funcionalidades existentes.

**Independent Test**: Ejecutar flujo E2E de alta/listado/edicion/baja de empleados y operaciones principales de departamentos autenticando con correo valido.

**Acceptance Scenarios**:

1. **Given** endpoints de negocio protegidos, **When** se consumen con credenciales validas por correo, **Then** mantienen el comportamiento funcional esperado.
2. **Given** una solicitud sin credenciales o con correo inexistente, **When** accede a endpoint protegido, **Then** recibe respuesta no autorizada.

---

### Edge Cases

- Correo vacio o con formato invalido debe rechazarse en alta/actualizacion.
- Correo con espacios laterales debe normalizarse (trim) antes de validar formato y unicidad; si queda vacio, debe rechazarse.
- Correos que difieran solo por mayusculas/minusculas se consideran duplicados y deben rechazarse.
- Empleado sin correo registrado no debe poder autenticarse.
- Actualizacion de correo a uno ya existente debe fallar por unicidad.
- Cambio de correo debe invalidar autenticacion con el correo anterior.
- Contrasenas invalidas por politica minima deben rechazarse en alta/actualizacion.
- Empleados legacy sin correo previo deben recibir correo temporal `<clave>@local.invalid` sin detener el servicio.
- Intentos de login con correo temporal `<clave>@local.invalid` deben rechazarse hasta su reemplazo por correo real.
- Reemplazo de correo temporal a correo real debe permitirse solo a administrador autenticado.
- Debe existir una cuenta admin bootstrap con correo real para habilitar la primera operacion administrativa post-migracion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST autenticar endpoints de negocio con HTTP Basic usando `correo` y `contrasena` del empleado.
- **FR-002**: El sistema MUST agregar y persistir el campo `correo` en la entidad empleado.
- **FR-003**: El sistema MUST exigir `correo` obligatorio en alta de empleados.
- **FR-004**: El sistema MUST permitir actualizar `correo` en operaciones de actualizacion de empleado.
- **FR-005**: El sistema MUST validar formato de correo en alta y actualizacion de empleado.
- **FR-006**: El sistema MUST aplicar unicidad de correo case-insensitive entre empleados.
- **FR-007**: El sistema MUST rechazar autenticacion cuando el correo no exista o la contrasena no coincida.
- **FR-008**: El sistema MUST dejar de usar `nombre` como identificador de login.
- **FR-009**: El sistema MUST mantener la politica de contrasena vigente (minimo 8 caracteres con al menos 1 letra y 1 numero).
- **FR-010**: El sistema MUST mantener la autenticacion obligatoria en endpoints versionados publicos existentes.
- **FR-011**: El sistema MUST conservar comportamiento CRUD de empleados y departamentos sin cambios funcionales no solicitados.
- **FR-012**: El sistema MUST mantener contratos OpenAPI/Swagger actualizados con `correo` y reglas de autenticacion.
- **FR-013**: El sistema MUST mantener ejecucion en Docker con configuracion reproducible tras la migracion.
- **FR-014**: El sistema MUST migrar empleados existentes sin correo asignando correo temporal determinista con formato `<clave>@local.invalid`.
- **FR-015**: El sistema MUST permitir operar el servicio durante la migracion sin requerir carga manual previa de correos legacy.
- **FR-016**: El sistema MUST exigir cambio posterior de correo temporal a correo real mediante flujo de actualizacion autorizado.
- **FR-017**: El sistema MUST bloquear autenticacion cuando el correo del empleado sea temporal (`<clave>@local.invalid`).
- **FR-018**: El sistema MUST autorizar el reemplazo de correo temporal a correo real solo para administrador autenticado.
- **FR-019**: El sistema MUST mantener una cuenta admin bootstrap autenticable con correo real, fijo por entorno y configurable mediante variables de entorno para evitar lockout inicial.
- **FR-020**: El sistema MUST documentar credencial local base/equivalente de administrador con secreto `admin123` para pruebas locales controladas.

### Assumptions

- El esquema de autenticacion sigue siendo HTTP Basic; solo cambia el identificador de login de `nombre` a `correo`.
- El almacenamiento de contrasena permanece con hash BCrypt.
- El campo `nombre` se mantiene como dato de negocio y deja de usarse para autenticacion.
- No se incluye en este alcance flujo de recuperacion de contrasena por correo.
- El formato de correo valido sigue criterios estandar de correo electronico ampliamente aceptados.
- El correo temporal `<clave>@local.invalid` se considera transitorio y no representa correo real de contacto.
- Las cuentas con correo temporal no son autenticables hasta registrar correo real.
- Se dispone de un rol administrador autenticado para ejecutar el reemplazo inicial de correos temporales.
- La cuenta admin bootstrap usa correo real no temporal y sus credenciales se gestionan por configuracion de entorno en despliegues no locales.

### Key Entities *(include if feature involves data)*

- **Empleado**: Entidad de negocio y autenticacion que ahora incorpora `correo` unico para login, junto con `contrasena` para validacion de credenciales.
- **Credencial de Acceso**: Combinacion `correo` + `contrasena` presentada por cliente para acceso a endpoints protegidos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de accesos con credenciales validas (`correo` + contrasena) deben autorizarse correctamente en endpoints protegidos.
- **SC-002**: El 100% de accesos con correo inexistente o contrasena invalida deben responder no autorizado.
- **SC-003**: El 100% de altas y actualizaciones de empleados deben rechazar correos invalidos o duplicados case-insensitive.
- **SC-004**: Al menos el 95% de operaciones CRUD autenticadas principales deben completarse en menos de 2 segundos en entorno local/QA.
