# Feature Specification: Gestion de Departamentos Relacionados con Empleados

**Feature Branch**: `001-departamentos-empleados-relacion`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "crea una entidad departamentos con los campos clave, nombre y una lista de empleados, que la primary key sea clave, nombre tenga 100 caracteres, además cambia la entidad empleados para que esté ligada a la entidad departamentos"

## Clarifications

### Session 2026-03-10

- Q: En `Departamento`, como debe representarse la lista de empleados asociados en la respuesta API? -> A: Lista de claves de empleados asociados.
- Q: Que formato debe usar la `clave` de `Departamento`? -> A: Patron `^D[0-9]+$`.
- Q: Como se define la `clave` de `Departamento` (manual o autogenerada)? -> A: Autogenerada por el sistema en formato `D` + secuencia.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar y consultar departamentos (Priority: P1)

Como usuario administrador, quiero crear departamentos con nombre para organizar empleados por unidad operativa.

**Why this priority**: Sin departamentos no se puede cumplir la relación solicitada con empleados.

**Independent Test**: Crear un departamento con nombre válido, luego consultarlo y verificar que retorna `clave` autogenerada (`D` + dígitos) y lista de empleados vacía inicialmente.

**Acceptance Scenarios**:

1. **Given** que se solicita crear un departamento con nombre válido, **When** el usuario registra el departamento, **Then** el sistema genera la `clave` en patrón `^D[0-9]+$` y devuelve una lista de empleados vacía.
2. **Given** que ya existen departamentos previos, **When** el usuario crea un nuevo departamento válido, **Then** el sistema asigna una nueva `clave` sin colisionar con claves existentes.

---

### User Story 2 - Asociar empleados a un departamento (Priority: P2)

Como usuario administrador, quiero que cada empleado esté asociado a un departamento existente para mantener consistencia organizacional.

**Why this priority**: La relación departamento-empleado es el objetivo central del cambio funcional.

**Independent Test**: Crear un departamento, registrar un empleado asociado a ese departamento y validar que al consultar el empleado se muestre la clave del departamento asignado.

**Acceptance Scenarios**:

1. **Given** que existe un departamento válido, **When** el usuario crea o actualiza un empleado indicando ese departamento, **Then** el empleado queda asociado correctamente.
2. **Given** que el departamento indicado no existe, **When** el usuario crea o actualiza un empleado, **Then** el sistema rechaza la operación con mensaje claro de no encontrado.

---

### User Story 3 - Gestionar integridad al eliminar departamentos (Priority: P3)

Como usuario administrador, quiero eliminar departamentos solo cuando no tengan empleados asociados para evitar datos inconsistentes.

**Why this priority**: Protege la integridad del modelo y evita referencias colgantes.

**Independent Test**: Intentar eliminar un departamento con empleados asociados y verificar rechazo; luego eliminar un departamento sin empleados y verificar éxito.

**Acceptance Scenarios**:

1. **Given** un departamento con uno o más empleados asociados, **When** el usuario intenta eliminarlo, **Then** el sistema rechaza la operación por dependencia activa.
2. **Given** un departamento sin empleados asociados, **When** el usuario lo elimina, **Then** el sistema confirma eliminación y deja de retornarlo en consultas.

---

### Edge Cases

- Departamento con `nombre` exactamente de 100 caracteres debe aceptarse.
- Departamento con `nombre` mayor a 100 caracteres debe rechazarse.
- Departamento con `clave` fuera del patron `^D[0-9]+$` debe rechazarse.
- Empleado existente con departamento eliminado previamente no debe quedar en estado inconsistente.
- Creación/actualización de empleado con clave de departamento vacía debe rechazarse.
- Reasignación de empleado entre departamentos debe reflejarse al consultar ambos departamentos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST generar automáticamente la `clave` de departamento como identificador único con patrón `^D[0-9]+$`.
- **FR-002**: El sistema MUST limitar el campo `nombre` de departamento a un máximo de 100 caracteres.
- **FR-002b**: El sistema MUST rechazar cualquier intento de creación de departamento que incluya `clave` en el payload de entrada.
- **FR-003**: El sistema MUST permitir consultar departamentos incluyendo su lista de `claves` de empleados asociados (sin expandir objeto completo de empleado).
- **FR-004**: El sistema MUST obligar que cada empleado quede asociado a un departamento existente.
- **FR-005**: El sistema MUST rechazar creación o actualización de empleado cuando el departamento indicado no exista.
- **FR-006**: El sistema MUST mantener la relación entre empleado y departamento durante altas, consultas, actualizaciones y eliminaciones.
- **FR-007**: El sistema MUST impedir eliminar un departamento que tenga empleados asociados.
- **FR-008**: El sistema MUST permitir eliminar un departamento cuando no tenga empleados asociados.
- **FR-009**: El sistema MUST mantener autenticación HTTP Basic en operaciones de empleados y departamentos.
- **FR-010**: El sistema MUST mantener contrato OpenAPI actualizado para los recursos de empleados y departamentos.
- **FR-011**: El sistema MUST mantener versionado explícito de la API pública.

### Assumptions

- La `clave` de departamento es autogenerada por el sistema y no editable por cliente.
- No se requiere, en este alcance, cambiar la generación automática de clave de empleado.
- Las operaciones de consulta listada continúan usando paginación obligatoria en endpoints públicos.
- La eliminación de departamentos con empleados asociados se maneja como validación de negocio y no como eliminación en cascada.

### Key Entities *(include if feature involves data)*

- **Departamento**: Unidad organizacional con `clave` (PK), `nombre` (max 100) y colección de `claves` de empleados asociados para respuesta API.
- **Empleado**: Registro de persona con identificador propio y referencia obligatoria al departamento al que pertenece.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los departamentos creados con datos válidos se registran y consultan correctamente con su clave y nombre.
- **SC-002**: El 100% de las operaciones de alta/actualización de empleados con departamento inexistente son rechazadas con mensaje de error claro.
- **SC-003**: El 100% de los intentos de eliminar departamentos con empleados asociados son bloqueados.
- **SC-004**: Al menos el 95% de las operaciones válidas de alta y consulta de departamentos y empleados se completan en menos de 2 segundos en entorno local de prueba.
