# Tasks: Gestion de Departamentos Relacionados con Empleados

**Input**: Design documents from `/specs/001-departamentos-empleados-relacion/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se generan tareas de pruebas automaticas porque no fueron solicitadas explicitamente en la especificacion. Se incluye validacion manual E2E en fase final.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All tasks include exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base tecnica para extender el CRUD actual con departamentos

- [ ] T001 Verificar y ajustar dependencias requeridas (Spring Data JPA, Validation, Flyway, springdoc) en pom.xml
- [ ] T002 [P] Verificar configuracion de entorno local para PostgreSQL y credenciales Basic Auth en src/main/resources/application.properties
- [ ] T003 [P] Preparar artefactos base de documentacion de la feature en specs/001-departamentos-empleados-relacion/plan.md y specs/001-departamentos-empleados-relacion/research.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura de datos y modelo compartido que bloquea todas las historias

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Crear migracion Flyway para secuencia y tabla de departamentos con FK hacia empleados en src/main/resources/db/migration/V2__create_departamentos_and_link_empleados.sql
- [ ] T005 [P] Crear entidad `Departamento` (clave PK, nombre max 100, lista de empleados) en src/main/java/com/example/empleados/domain/Departamento.java
- [ ] T006 [P] Actualizar entidad `Empleado` para relacion obligatoria con `Departamento` en src/main/java/com/example/empleados/domain/Empleado.java
- [ ] T007 Crear repositorio de departamentos y consultas auxiliares de integridad en src/main/java/com/example/empleados/repository/DepartamentoRepository.java y src/main/java/com/example/empleados/repository/EmpleadoRepository.java
- [ ] T008 [P] Incorporar manejo de validaciones de negocio (IllegalArgumentException -> 400) en src/main/java/com/example/empleados/api/GlobalExceptionHandler.java
- [ ] T009 Definir/ajustar DTOs base para departamentos y relacion de empleado en src/main/java/com/example/empleados/api/dto/DepartamentoRequest.java, src/main/java/com/example/empleados/api/dto/DepartamentoResponse.java, src/main/java/com/example/empleados/api/dto/DepartamentoPageResponse.java y src/main/java/com/example/empleados/api/dto/EmpleadoResponse.java

**Checkpoint**: Base de datos, modelo relacional y contratos DTO compartidos listos

---

## Phase 3: User Story 1 - Registrar y consultar departamentos (Priority: P1) 🎯 MVP

**Goal**: Permitir alta y consulta de departamentos con `clave` autogenerada `D+secuencia`, nombre maximo 100 y lista de claves de empleados

**Independent Test**: Ejecutar `POST /api/v1/departamentos` enviando solo `nombre`; validar `201` con `clave` autogenerada (`^D[0-9]+$`) y `empleados` vacio. Consultar luego `GET /api/v1/departamentos/{clave}` y listado paginado `GET /api/v1/departamentos?page=0&size=10`.

### Implementation for User Story 1

- [ ] T010 [US1] Implementar secuencia de clave de departamento (`D` + numero) en src/main/java/com/example/empleados/service/DepartamentoService.java
- [ ] T011 [US1] Implementar logica de creacion y consulta de departamentos en src/main/java/com/example/empleados/service/DepartamentoService.java
- [ ] T012 [US1] Implementar listado paginado de departamentos en src/main/java/com/example/empleados/service/DepartamentoService.java
- [ ] T013 [US1] Implementar endpoint `POST /api/v1/departamentos` rechazando `clave` en payload en src/main/java/com/example/empleados/api/DepartamentoController.java
- [ ] T014 [US1] Implementar endpoints `GET /api/v1/departamentos/{clave}` y `GET /api/v1/departamentos` en src/main/java/com/example/empleados/api/DepartamentoController.java
- [ ] T015 [US1] Documentar operaciones de departamento (`201/200/400/401/404`) con anotaciones OpenAPI en src/main/java/com/example/empleados/api/DepartamentoController.java

**Checkpoint**: US1 entrega valor por si sola y es demostrable como MVP

---

## Phase 4: User Story 2 - Asociar empleados a un departamento (Priority: P2)

**Goal**: Obligar que empleados se creen/actualicen con `departamentoClave` existente y reflejar asociacion en respuestas

**Independent Test**: Crear departamento, luego crear empleado con `departamentoClave` valido (`201`) y verificar en `GET /api/v1/empleados/{clave}` que se incluya la clave del departamento. Repetir con departamento inexistente y validar error.

### Implementation for User Story 2

- [ ] T016 [US2] Extender validaciones de entrada de empleado con `departamentoClave` obligatorio en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java y src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java
- [ ] T017 [US2] Actualizar servicio de empleados para validar existencia de departamento en create/update en src/main/java/com/example/empleados/service/EmpleadoService.java
- [ ] T018 [US2] Actualizar mapeo de respuesta de empleado para incluir `departamentoClave` en src/main/java/com/example/empleados/service/EmpleadoService.java y src/main/java/com/example/empleados/api/dto/EmpleadoResponse.java
- [ ] T019 [US2] Ajustar endpoint de creacion/actualizacion de empleados para nuevo contrato de payload en src/main/java/com/example/empleados/api/EmpleadoController.java
- [ ] T020 [US2] Actualizar endpoint de consulta de departamento para devolver lista de claves de empleados asociados en src/main/java/com/example/empleados/service/DepartamentoService.java
- [ ] T021 [US2] Documentar cambios de contrato de empleados y departamentos en src/main/java/com/example/empleados/api/EmpleadoController.java y src/main/java/com/example/empleados/api/DepartamentoController.java

**Checkpoint**: US2 funciona de forma independiente sobre base de US1

---

## Phase 5: User Story 3 - Gestionar integridad al eliminar departamentos (Priority: P3)

**Goal**: Impedir eliminacion de departamentos con empleados asociados y permitir eliminacion cuando no existan asociados

**Independent Test**: Intentar `DELETE /api/v1/departamentos/{clave}` con empleados asociados (esperar `400`), desasociar/eliminar empleados y reintentar (esperar `204`).

### Implementation for User Story 3

- [ ] T022 [US3] Implementar validacion de dependencia de empleados antes de eliminar departamento en src/main/java/com/example/empleados/service/DepartamentoService.java
- [ ] T023 [US3] Implementar endpoint `DELETE /api/v1/departamentos/{clave}` con respuesta `204` en src/main/java/com/example/empleados/api/DepartamentoController.java
- [ ] T024 [US3] Ajustar mensajes de error de negocio para bloqueo por integridad referencial en src/main/java/com/example/empleados/service/DepartamentoService.java y src/main/java/com/example/empleados/api/GlobalExceptionHandler.java
- [ ] T025 [US3] Documentar reglas de eliminacion de departamento (`204/400/404/401`) en src/main/java/com/example/empleados/api/DepartamentoController.java

**Checkpoint**: Integridad de negocio asegurada para eliminaciones de departamentos

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre transversal, consistencia documental y validacion operativa

- [ ] T026 [P] Alinear contrato OpenAPI final de la feature con implementacion real en specs/001-departamentos-empleados-relacion/contracts/departamentos-empleados.openapi.yaml
- [ ] T027 [P] Actualizar guia operativa con flujo final de alta departamento + empleado asociado en specs/001-departamentos-empleados-relacion/quickstart.md
- [ ] T028 Ejecutar validacion manual E2E (crear departamento, asociar empleado, consultar, bloqueo de delete, delete exitoso) y registrar resultados en specs/001-departamentos-empleados-relacion/quickstart.md
- [ ] T029 Validar build sin pruebas para confirmar integracion de cambios (`mvn -q -DskipTests compile`) y registrar evidencia en specs/001-departamentos-empleados-relacion/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea historias
- **US1 (Phase 3)**: depende de Foundational
- **US2 (Phase 4)**: depende de Foundational y usa componentes de US1
- **US3 (Phase 5)**: depende de Foundational y de logica de relacion incorporada en US2
- **Polish (Phase 6)**: depende de historias objetivo completas

### User Story Dependencies (Completion Graph)

- **US1 (P1)**: base funcional de departamentos
- **US2 (P2)**: requiere modelo de departamentos disponible (US1)
- **US3 (P3)**: requiere relacion empleado-departamento activa (US2)

Representacion:

`Setup -> Foundational -> US1 -> US2 -> US3 -> Polish`

### Within Each User Story

- Servicios antes de controladores
- Controladores antes de documentacion final de endpoints
- Documentacion del story al final de la historia

### Parallel Opportunities

- **Setup**: T002 y T003 en paralelo
- **Foundational**: T005, T006 y T008 en paralelo tras T004
- **Polish**: T026 y T027 en paralelo

---

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] Endpoint POST departamentos en src/main/java/com/example/empleados/api/DepartamentoController.java"
Task: "T014 [US1] Endpoints GET departamentos en src/main/java/com/example/empleados/api/DepartamentoController.java"
```

## Parallel Example: User Story 2

```bash
Task: "T016 [US2] Validaciones DTO de empleado en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java y src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java"
Task: "T018 [US2] Mapeo de respuesta con departamentoClave en src/main/java/com/example/empleados/service/EmpleadoService.java y src/main/java/com/example/empleados/api/dto/EmpleadoResponse.java"
```

## Parallel Example: User Story 3

```bash
Task: "T024 [US3] Mensajes de error de negocio en src/main/java/com/example/empleados/service/DepartamentoService.java y src/main/java/com/example/empleados/api/GlobalExceptionHandler.java"
Task: "T025 [US3] Documentacion de reglas de delete en src/main/java/com/example/empleados/api/DepartamentoController.java"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar Phase 3 (US1)
4. Validar US1 independientemente
5. Demostrar MVP

### Incremental Delivery

1. Setup + Foundational
2. Entregar US1 (departamentos)
3. Entregar US2 (asociacion empleados)
4. Entregar US3 (integridad de eliminacion)
5. Cierre con Polish

### Parallel Team Strategy

1. Equipo conjunto en Setup + Foundational
2. Luego por historia:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3
3. Integrar y cerrar con fase Polish

---

## Notes

- Todas las tareas usan formato checklist estricto: `- [ ] T### [P?] [US?] Descripcion con ruta`
- No se incluyeron tareas de pruebas automaticas por no ser requerimiento explicito del spec
- Cada historia define criterio de prueba independiente y demostrable
