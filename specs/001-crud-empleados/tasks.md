# Tasks: CRUD de Empleados

**Input**: Design documents from `/specs/001-crud-empleados/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No se generaron tareas de pruebas automáticas porque no fueron solicitadas explícitamente en la especificación.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All tasks include exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar proyecto Spring Boot 3 + Java 17 y base de contenedores

- [X] T001 Crear `pom.xml` con dependencias Spring Boot 3, Security, Data JPA, Validation, PostgreSQL, Flyway y springdoc en pom.xml
- [X] T002 Crear clase de arranque Spring Boot en src/main/java/com/example/empleados/EmpleadosApplication.java
- [X] T003 [P] Crear estructura base de paquetes (`api`, `service`, `domain`, `repository`, `config`) con clases placeholder en src/main/java/com/example/empleados/
- [X] T004 [P] Crear Dockerfile para empaquetado y ejecución de la API en Dockerfile
- [X] T005 [P] Crear orquestación local app + postgres en docker/compose.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura común bloqueante para todas las historias

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Configurar propiedades base (DB, JPA, Flyway, Swagger, credenciales Basic Auth por variables de entorno) en src/main/resources/application.properties
- [X] T007 Implementar configuración de seguridad HTTP Basic y usuario local `admin/admin123` sobreescribible por entorno en src/main/java/com/example/empleados/config/SecurityConfig.java
- [X] T008 [P] Implementar modelo de error y manejador global de excepciones en src/main/java/com/example/empleados/api/ErrorResponse.java y src/main/java/com/example/empleados/api/GlobalExceptionHandler.java
- [X] T009 [P] Crear migración Flyway inicial de tabla `empleados` (`clave` varchar(32) PK con formato `E` + secuencia, `nombre|direccion|telefono` varchar(100) not null) en src/main/resources/db/migration/V1__create_empleados_table.sql
- [X] T010 Crear entidad JPA `Empleado` y repositorio base en src/main/java/com/example/empleados/domain/Empleado.java y src/main/java/com/example/empleados/repository/EmpleadoRepository.java
- [X] T011 [P] Implementar configuración OpenAPI con esquema `basicAuth` y metadatos del servicio en src/main/java/com/example/empleados/config/OpenApiConfig.java
- [X] T012 Definir DTOs compartidos (`CreateEmpleadoRequest`, `UpdateEmpleadoRequest`, `EmpleadoResponse`, `EmpleadoPageResponse`) en src/main/java/com/example/empleados/api/dto/

**Checkpoint**: Base técnica lista; historias de usuario pueden implementarse

---

## Phase 3: User Story 1 - Registrar empleado (Priority: P1) 🎯 MVP

**Goal**: Permitir alta de empleado con `clave` mixta autogenerada (`E` + secuencia) y validaciones obligatorias

**Independent Test**: Enviar `POST /api/v1/empleados` con credenciales Basic Auth válidas y payload válido; verificar respuesta `201` con `clave` generada en formato `E` + dígitos. Enviar payload inválido y verificar `400`.

### Implementation for User Story 1

- [X] T013 [US1] Implementar validaciones Bean Validation (not blank + max 100) en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java
- [X] T014 [US1] Implementar lógica de creación (sin permitir `clave` en request) en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T015 [US1] Implementar endpoint `POST /api/v1/empleados` en src/main/java/com/example/empleados/api/EmpleadoController.java
- [X] T016 [US1] Documentar operación de creación y respuestas (`201/400/401`) con anotaciones Swagger en src/main/java/com/example/empleados/api/EmpleadoController.java

**Checkpoint**: User Story 1 funcional e independiente (MVP)

---

## Phase 4: User Story 2 - Consultar empleados (Priority: P2)

**Goal**: Consultar empleado por clave y listar empleados con paginación obligatoria

**Independent Test**: Consultar `GET /api/v1/empleados/{clave}` existente/no existente (`200/404`) y `GET /api/v1/empleados?page=0&size=10` (`200`); validar que sin `page` o `size` retorne `400`.

### Implementation for User Story 2

- [X] T017 [US2] Implementar servicio de consulta por `clave` con manejo de no encontrado en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T018 [US2] Implementar endpoint `GET /api/v1/empleados/{clave}` en src/main/java/com/example/empleados/api/EmpleadoController.java
- [X] T019 [US2] Implementar servicio de listado paginado (`Pageable`) en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T020 [US2] Implementar endpoint `GET /api/v1/empleados` con `page` y `size` obligatorios en src/main/java/com/example/empleados/api/EmpleadoController.java
- [X] T021 [US2] Implementar validación de patrón de identificador `^E[0-9]+$` para operaciones por `clave` en src/main/java/com/example/empleados/api/EmpleadoController.java
- [X] T022 [US2] Documentar operaciones de consulta y paginación (`200/400/401/404`) con Swagger en src/main/java/com/example/empleados/api/EmpleadoController.java

**Checkpoint**: User Stories 1 y 2 funcionales e independientes

---

## Phase 5: User Story 3 - Actualizar y eliminar empleado (Priority: P3)

**Goal**: Actualizar datos editables y eliminar empleados de forma física

**Independent Test**: Ejecutar `PUT /api/v1/empleados/{clave}` válido (`200`) y luego `DELETE /api/v1/empleados/{clave}` (`204`); confirmar que una consulta posterior retorna `404`.

### Implementation for User Story 3

- [X] T023 [US3] Implementar validaciones Bean Validation (not blank + max 100) para actualización en src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java
- [X] T024 [US3] Implementar lógica de actualización sin modificar `clave` en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T025 [US3] Implementar lógica de eliminación física por `clave` en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T026 [US3] Implementar endpoints `PUT /api/v1/empleados/{clave}` y `DELETE /api/v1/empleados/{clave}` en src/main/java/com/example/empleados/api/EmpleadoController.java
- [X] T027 [US3] Documentar operaciones de actualización/eliminación (`200/204/400/401/404`) con Swagger en src/main/java/com/example/empleados/api/EmpleadoController.java

**Checkpoint**: Todas las historias funcionales e independientes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre transversal, verificación de contrato y experiencia de ejecución

- [X] T028 [P] Alinear y validar contrato OpenAPI final con implementación en specs/001-crud-empleados/contracts/empleados.openapi.yaml
- [X] T029 [P] Ajustar guía de ejecución con comandos reales y variables efectivas en specs/001-crud-empleados/quickstart.md
- [ ] T030 Ejecutar validación manual end-to-end de quickstart (alta, consulta, paginación, actualización, eliminación) y registrar resultados en specs/001-crud-empleados/quickstart.md
- [X] T031 Verificar externalización de credenciales no locales y consistencia con constitución en src/main/resources/application.properties y docker/compose.yml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea historias
- **US1/US2/US3 (Phases 3-5)**: dependen de Foundational
- **Polish (Phase 6)**: depende de historias objetivo completas

### User Story Dependencies (Completion Graph)

- **US1 (P1)**: inicia después de Phase 2
- **US2 (P2)**: inicia después de Phase 2; no depende funcionalmente de US1
- **US3 (P3)**: inicia después de Phase 2; depende de base CRUD común, no de completar US2

Representación:

`Setup -> Foundational -> {US1, US2, US3} -> Polish`

### Within Each User Story

- DTO/validaciones antes de lógica de servicio
- Servicio antes de endpoints
- Endpoints antes de documentación Swagger final de la historia

### Parallel Opportunities

- **Phase 1**: T003, T004 y T005 en paralelo tras T001-T002
- **Phase 2**: T008, T009 y T011 en paralelo tras T006-T007
- **Post-foundation**: US1, US2 y US3 pueden avanzar en paralelo por distintos desarrolladores
- **Phase 6**: T027 y T028 en paralelo

---

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] Validaciones CreateEmpleadoRequest en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java"
Task: "T014 [US1] Lógica de creación en src/main/java/com/example/empleados/service/EmpleadoService.java"
```

## Parallel Example: User Story 2

```bash
Task: "T018 [US2] GET por clave en src/main/java/com/example/empleados/api/EmpleadoController.java"
Task: "T019 [US2] Servicio de paginación en src/main/java/com/example/empleados/service/EmpleadoService.java"
```

## Parallel Example: User Story 3

```bash
Task: "T023 [US3] Actualización en src/main/java/com/example/empleados/service/EmpleadoService.java"
Task: "T024 [US3] Eliminación física en src/main/java/com/example/empleados/service/EmpleadoService.java"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar Phase 3 (US1)
4. Validar US1 de forma independiente (alta + validaciones)
5. Demostrar MVP

### Incremental Delivery

1. Setup + Foundational
2. Entregar US1 (alta)
3. Entregar US2 (consulta + listado paginado)
4. Entregar US3 (actualización + eliminación física)
5. Cierre de Polish y validación quickstart

### Parallel Team Strategy

1. Equipo completo en Setup + Foundational
2. Luego dividir por historia:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3
3. Integrar y cerrar con Phase 6

---

## Notes

- Todas las tareas usan formato checklist estricto: `- [ ] T### [P?] [US?] Descripción con ruta`
- Se omitieron tareas de pruebas automáticas por no estar explícitamente solicitadas
- Cada historia mantiene criterio de prueba independiente para entrega incremental
