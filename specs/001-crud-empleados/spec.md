# Feature Specification: CRUD de Empleados

**Feature Branch**: `001-crud-empleados`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User description: "crear un crud de empleados con campos clave, nombre, direccion y telefono. Donde clave sea pk, y los demas campos sean de 100 espacios."

## Clarifications

### Session 2026-02-25

- Q: ¿Cómo debe definirse `clave`? → A: mixta con prefijo `E` seguido de autonumérico secuencial (generado por sistema).
- Q: ¿Qué tipo de eliminación debe usar el CRUD? → A: eliminación física (hard delete).
- Q: ¿Cómo debe comportarse el listado de empleados? → A: paginación obligatoria (`page`, `size`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar empleado (Priority: P1)

Como usuario administrativo, quiero registrar un empleado con su información básica para que quede disponible en el sistema.

**Why this priority**: Sin alta de empleados, no existe información base para ninguna operación posterior.

**Independent Test**: Puede probarse enviando una solicitud de creación con datos válidos y verificando que el registro quede almacenado y recuperable.

**Acceptance Scenarios**:

1. **Given** que no existe un empleado con la clave enviada, **When** se registra un empleado con clave, nombre, dirección y teléfono válidos, **Then** el sistema crea el empleado y confirma el alta.
2. **Given** que falta alguno de los campos obligatorios, **When** se intenta registrar el empleado, **Then** el sistema rechaza la solicitud e indica los campos inválidos.

---

### User Story 2 - Consultar empleados (Priority: P2)

Como usuario administrativo, quiero consultar un empleado específico por su clave y listar empleados paginados para revisar la información existente.

**Why this priority**: La consulta permite validar y usar los datos capturados en los procesos operativos.

**Independent Test**: Puede probarse consultando por clave existente/no existente y solicitando el listado general para verificar resultados consistentes.

**Acceptance Scenarios**:

1. **Given** que existe un empleado registrado, **When** se consulta por su clave, **Then** el sistema devuelve sus datos completos.
2. **Given** que no existe un empleado con la clave consultada, **When** se solicita su detalle, **Then** el sistema responde que el recurso no fue encontrado.
3. **Given** que existen empleados registrados, **When** se solicita el listado con `page` y `size`, **Then** el sistema devuelve la página solicitada de empleados disponibles.

---

### User Story 3 - Actualizar y eliminar empleado (Priority: P3)

Como usuario administrativo, quiero actualizar y eliminar empleados para mantener la información vigente y depurada.

**Why this priority**: Completa el ciclo CRUD y evita datos obsoletos o incorrectos.

**Independent Test**: Puede probarse actualizando un empleado existente y luego eliminándolo, verificando ambos resultados de forma independiente.

**Acceptance Scenarios**:

1. **Given** que existe un empleado, **When** se actualizan su nombre, dirección o teléfono con valores válidos, **Then** el sistema guarda y devuelve la versión actualizada.
2. **Given** que existe un empleado, **When** se solicita su eliminación por clave, **Then** el sistema elimina el registro y deja de retornarlo en consultas posteriores.

### Edge Cases

- Intento de consultar, actualizar o eliminar con una `clave` que no cumpla formato `E` + secuencia numérica.
- Intento de registrar o actualizar `nombre`, `direccion` o `telefono` con más de 100 caracteres.
- Intento de registrar o actualizar `nombre`, `direccion` o `telefono` con valor vacío o solo espacios.
- Intento de actualizar o eliminar una clave inexistente.
- Intento de listar empleados sin enviar `page` o `size`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir crear empleados con los campos `clave`, `nombre`, `direccion` y `telefono`.
- **FR-002**: El sistema MUST tratar `clave` como identificador único y obligatorio del empleado, generado automáticamente por el sistema con formato `E` + secuencia numérica.
- **FR-003**: El sistema MUST impedir la creación de empleados con `clave` duplicada.
- **FR-003A**: El sistema MUST impedir que el cliente envíe manualmente el valor de `clave` en la operación de creación.
- **FR-003B**: El sistema MUST validar en operaciones por identificador que `clave` cumpla el patrón `E` seguido de uno o más dígitos.
- **FR-004**: El sistema MUST permitir consultar un empleado por su `clave`.
- **FR-005**: El sistema MUST permitir listar empleados exclusivamente de forma paginada mediante `page` y `size`.
- **FR-005A**: El sistema MUST rechazar solicitudes de listado que no incluyan `page` y `size`.
- **FR-006**: El sistema MUST permitir actualizar `nombre`, `direccion` y `telefono` de un empleado existente sin cambiar su `clave`.
- **FR-007**: El sistema MUST permitir eliminar un empleado por `clave`.
- **FR-007A**: El sistema MUST aplicar eliminación física; una vez eliminado, el empleado no debe conservarse para consultas funcionales del CRUD.
- **FR-008**: El sistema MUST validar que `nombre`, `direccion` y `telefono` tengan una longitud máxima de 100 caracteres cada uno.
- **FR-009**: El sistema MUST rechazar solicitudes con campos obligatorios faltantes o inválidos.
- **FR-010**: El sistema MUST devolver mensajes de error claros cuando el empleado no exista o la validación falle.

### Key Entities *(include if feature involves data)*

- **Empleado**: Representa a una persona registrada en la organización. Atributos clave: `clave` (identificador único mixto con prefijo `E` y secuencia numérica autogenerada), `nombre` (texto hasta 100), `direccion` (texto hasta 100), `telefono` (texto hasta 100).

### Assumptions

- La `clave` es autogenerada por el sistema con formato `E` + secuencia numérica y no se captura desde el cliente en altas.
- Los campos `nombre`, `direccion` y `telefono` son obligatorios para alta y actualización.
- El alcance incluye únicamente operaciones CRUD de empleados y sus validaciones de entrada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de intentos de alta con `clave` duplicada son rechazados.
- **SC-002**: El 100% de operaciones de creación y actualización rechazan valores de `nombre`, `direccion` o `telefono` mayores a 100 caracteres.
- **SC-003**: Al menos el 95% de operaciones CRUD válidas completan su respuesta en menos de 2 segundos en ambiente de pruebas funcionales.
- **SC-004**: El 100% de búsquedas, actualizaciones y eliminaciones sobre claves inexistentes retornan un resultado de “no encontrado” consistente.
