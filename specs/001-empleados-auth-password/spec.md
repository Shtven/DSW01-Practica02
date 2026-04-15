# Feature Specification: Autenticacion por Empleado

**Feature Branch**: `001-empleados-auth-password`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "cambia la autenticacion basica, ahora la autenticacion sera mediante la entidad empleados usando su nombre y contrasena, agrega el campo contrasena a la entidad"

## Clarifications

### Session 2026-03-10

- Q: Que algoritmo de hash debe usarse para `contrasena`? -> A: BCrypt.
- Q: Como se define la comparacion de `nombre` para login? -> A: Case-insensitive, normalizado a minusculas.
- Q: Que politica minima debe cumplir la `contrasena`? -> A: Minimo 8 caracteres con al menos 1 letra y 1 numero.

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

### User Story 1 - Iniciar Sesion con Empleado (Priority: P1)

Como empleado, quiero autenticarme con mi nombre y contrasena para acceder a los endpoints protegidos.

**Why this priority**: La autenticacion es el cambio principal solicitado y bloquea cualquier acceso funcional.

**Independent Test**: Crear un empleado activo con contrasena valida y ejecutar una llamada protegida con credenciales de Basic Auth `nombre:contrasena`; validar acceso permitido. Repetir con contrasena invalida y validar rechazo.

**Acceptance Scenarios**:

1. **Given** un empleado existente con nombre y contrasena validos, **When** envia credenciales Basic Auth correctas, **Then** el sistema autoriza el acceso.
2. **Given** un empleado existente, **When** envia una contrasena incorrecta, **Then** el sistema rechaza el acceso sin exponer detalles sensibles.

---

### User Story 2 - Gestionar Contrasena en Empleados (Priority: P2)

Como administrador, quiero registrar y actualizar contrasenas de empleados para habilitar su autenticacion individual.

**Why this priority**: Sin una contrasena por empleado no es posible sostener el nuevo esquema de autenticacion.

**Independent Test**: Crear empleado con contrasena requerida, actualizarla y verificar que solo la nueva contrasena permite autenticacion.

**Acceptance Scenarios**:

1. **Given** un alta de empleado valida, **When** se envia contrasena en el registro, **Then** el empleado queda autenticable con su nombre y contrasena.
2. **Given** un empleado existente, **When** se cambia su contrasena, **Then** la anterior deja de autenticar y la nueva autentica correctamente.

---

### User Story 3 - Mantener Compatibilidad Operativa (Priority: P3)

Como administrador de sistema, quiero conservar el comportamiento funcional de empleados/departamentos despues del cambio de autenticacion para no introducir regresiones.

**Why this priority**: Evita interrupciones operativas al migrar del usuario tecnico fijo a identidad por empleado.

**Independent Test**: Ejecutar flujo E2E completo de departamentos y empleados usando una cuenta de empleado autenticable y validar codigos esperados.

**Acceptance Scenarios**:

1. **Given** endpoints de negocio protegidos, **When** se accede con un empleado valido, **Then** las operaciones CRUD siguen funcionando con el mismo contrato funcional esperado.
2. **Given** un intento de acceso sin credenciales o con usuario inexistente, **When** se llama cualquier endpoint protegido, **Then** el sistema responde no autorizado.

---

### Edge Cases

- Empleado con nombre vacio o solo espacios no debe autenticarse.
- Empleado sin contrasena registrada no debe autenticarse.
- Dos empleados con el mismo nombre deben evitarse o rechazarse por regla de unicidad.
- Nombres de empleado que difieran solo por mayusculas/minusculas deben tratarse como duplicados.
- Contrasenas con menos de 8 caracteres o sin combinacion de letra y numero deben rechazarse.
- Cambio de contrasena debe invalidar autenticacion con valor anterior.
- Credenciales incorrectas reiteradas deben mantener respuesta uniforme de no autorizado.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: El sistema MUST autenticar endpoints de negocio con credenciales Basic Auth basadas en `nombre` y `contrasena` de la entidad empleado.
- **FR-002**: El sistema MUST agregar y persistir el campo `contrasena` para cada empleado.
- **FR-003**: El sistema MUST requerir contrasena obligatoria en el alta de empleados.
- **FR-004**: El sistema MUST permitir actualizar contrasena de empleado dentro del flujo de actualizacion autorizado.
- **FR-005**: El sistema MUST rechazar autenticacion cuando el empleado no exista o la contrasena no coincida.
- **FR-006**: El sistema MUST dejar de depender de credenciales fijas de aplicacion para acceso de negocio.
- **FR-007**: El sistema MUST mantener autenticacion obligatoria sobre endpoints versionados publicos existentes.
- **FR-008**: El sistema MUST conservar funcionamiento CRUD de empleados y departamentos bajo el nuevo esquema de autenticacion.
- **FR-009**: El sistema MUST mantener contratos OpenAPI/Swagger alineados con el nuevo campo y reglas de autenticacion.
- **FR-010**: El sistema MUST ejecutarse en Docker con configuracion reproducible tras el cambio.
- **FR-011**: El sistema MUST almacenar y validar contrasenas usando hash BCrypt.
- **FR-012**: El sistema MUST normalizar `nombre` de login a minusculas y aplicar unicidad case-insensitive.
- **FR-013**: El sistema MUST validar `contrasena` con politica minima: 8+ caracteres, al menos una letra y al menos un numero.

### Assumptions

- El nombre de empleado se considera identificador de login unico en comparacion case-insensitive.
- La contrasena se almacena en forma no reversible mediante BCrypt.
- La politica minima de contrasena aplica en alta y actualizacion de empleado.
- No se requiere, en este alcance, flujo de recuperacion de contrasena.
- El esquema Basic Auth se mantiene; solo cambia la fuente de identidad.

### Key Entities *(include if feature involves data)*

- **Empleado**: Entidad de identidad y negocio con `nombre` y nuevo atributo `contrasena`, usada para autenticar accesos.
- **Credencial de Autenticacion**: Combinacion `nombre` + `contrasena` presentada por cliente para validar acceso a endpoints protegidos.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: El 100% de accesos con credenciales validas de empleado se autorizan correctamente en endpoints protegidos.
- **SC-002**: El 100% de accesos con usuario inexistente o contrasena invalida son rechazados con no autorizado.
- **SC-003**: El 100% de empleados creados desde la API incluyen contrasena valida segun reglas definidas.
- **SC-004**: Al menos el 95% de operaciones autenticadas de CRUD principales se completan en menos de 2 segundos en entorno local/QA.
