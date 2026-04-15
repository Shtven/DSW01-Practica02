# Tasks: Autenticacion por Correo de Empleado

**Input**: Design documents from `/specs/001-empleados-email-auth/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se generan tareas de pruebas automaticas porque no fueron solicitadas explicitamente en la especificacion. Se incluye validacion manual E2E en fase final.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All tasks include exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base tecnica para migrar login de `nombre` a `correo` sin romper el monolito actual

- [X] T001 Verificar alcance tecnico y dependencias vigentes en specs/001-empleados-email-auth/plan.md y pom.xml
- [X] T002 [P] Revisar configuracion de seguridad actual y propiedades externas en src/main/java/com/example/empleados/config/SecurityConfig.java y src/main/resources/application.properties
- [X] T003 [P] Alinear artefactos base de diseno para ejecucion tecnica en specs/001-empleados-email-auth/research.md y specs/001-empleados-email-auth/data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cambios de persistencia y modelos compartidos que bloquean todas las historias

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Crear migracion Flyway para agregar `correo`, backfill `<clave>@local.invalid`, unicidad case-insensitive y bootstrap admin por correo en src/main/resources/db/migration/V4__add_empleado_email_auth_and_bootstrap.sql
- [X] T005 [P] Actualizar entidad `Empleado` con campo `correo` y restricciones de persistencia en src/main/java/com/example/empleados/domain/Empleado.java
- [X] T006 [P] Extender `EmpleadoRepository` con consultas por correo normalizado y validaciones de unicidad en src/main/java/com/example/empleados/repository/EmpleadoRepository.java
- [X] T007 [P] Ajustar DTOs de empleado para incluir `correo` en entrada/salida y mantener `contrasena` no expuesta en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java, src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java y src/main/java/com/example/empleados/api/dto/EmpleadoResponse.java
- [X] T008 Incorporar validaciones y mapeo de errores de dominio (correo invalido/duplicado/temporal bloqueado) en src/main/java/com/example/empleados/api/GlobalExceptionHandler.java
- [X] T009 [P] Agregar constantes y utilidades de normalizacion/identificacion de correo temporal en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T010 Definir reglas de autorizacion para reemplazo de correo temporal solo administrador en src/main/java/com/example/empleados/config/SecurityConfig.java

**Checkpoint**: Esquema, modelo y contratos base listos para implementar historias

---

## Phase 3: User Story 1 - Iniciar Sesion con Correo (Priority: P1) MVP

**Goal**: Habilitar autenticacion Basic Auth con `correo + contrasena` y bloquear login de correos temporales

**Independent Test**: Crear empleado con correo real y contrasena valida, autenticar `GET /api/v1/empleados?page=0&size=10` con `correo:contrasena` (`200`); repetir con correo inexistente o contrasena incorrecta (`401`) y con correo temporal `@local.invalid` (`401`).

### Implementation for User Story 1

- [X] T011 [US1] Migrar `UserDetailsService` para resolver identidad por correo normalizado en src/main/java/com/example/empleados/service/EmpleadoUserDetailsService.java
- [X] T012 [US1] Implementar bloqueo explicito de correo temporal durante autenticacion en src/main/java/com/example/empleados/service/EmpleadoUserDetailsService.java
- [X] T013 [US1] Ajustar configuracion Basic Auth y entrypoint para flujo por correo en src/main/java/com/example/empleados/config/SecurityConfig.java
- [X] T014 [US1] Actualizar descripcion de esquema de seguridad en OpenAPI para username=correo en src/main/java/com/example/empleados/config/OpenApiConfig.java
- [X] T015 [US1] Actualizar quickstart de validacion de login por correo real y rechazo de temporal en specs/001-empleados-email-auth/quickstart.md

**Checkpoint**: US1 permite autenticacion por correo y rechaza casos invalidos/temporales

---

## Phase 4: User Story 2 - Gestionar Correo en Empleados (Priority: P2)

**Goal**: Gestionar alta y actualizacion de `correo` con formato valido, unicidad case-insensitive y reglas de reemplazo de temporal

**Independent Test**: Alta de empleado con correo valido (`201`), rechazo de correo duplicado o invalido (`400`), actualizacion de correo temporal a real por admin (`200`) y validacion de login solo con correo vigente.

### Implementation for User Story 2

- [X] T016 [US2] Aplicar validacion de formato de correo en DTOs de alta/actualizacion en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java y src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java
- [X] T017 [US2] Implementar normalizacion y unicidad case-insensitive de correo en create/update de empleados en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T018 [US2] Revalidar y mantener politica de contrasena vigente (8+, letra y numero) en create/update de empleados en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T019 [US2] Habilitar reemplazo de correo temporal a real solo con permiso administrativo en src/main/java/com/example/empleados/service/EmpleadoService.java
- [X] T020 [US2] Alinear endpoints de empleados con nuevo payload `correo` en src/main/java/com/example/empleados/api/EmpleadoController.java
- [X] T021 [US2] Ajustar mensajes de error para correo invalido/duplicado/temporal en src/main/java/com/example/empleados/api/GlobalExceptionHandler.java
- [X] T022 [US2] Actualizar mapeo de respuesta para incluir `correo` en src/main/java/com/example/empleados/service/EmpleadoService.java y src/main/java/com/example/empleados/api/dto/EmpleadoResponse.java
- [X] T023 [US2] Actualizar contrato OpenAPI de empleados con campo `correo` y restricciones de autorizacion en specs/001-empleados-email-auth/contracts/empleados-email-auth.openapi.yaml

**Checkpoint**: US2 garantiza calidad de datos de correo y reemplazo controlado de correos temporales

---

## Phase 5: User Story 3 - Mantener Continuidad Operativa (Priority: P3)

**Goal**: Mantener CRUD existente de empleados/departamentos bajo el nuevo esquema de autenticacion por correo

**Independent Test**: Ejecutar flujo CRUD principal de departamentos y empleados usando cuenta admin bootstrap por correo y cuenta de empleado con correo real, verificando codigos esperados sin regresiones funcionales.

### Implementation for User Story 3

- [X] T024 [US3] Asegurar bootstrap admin por correo real configurable por entorno en src/main/resources/db/migration/V4__add_empleado_email_auth_and_bootstrap.sql y src/main/resources/application.properties
- [X] T025 [US3] Revisar compatibilidad de seguridad en endpoints de departamentos con login por correo en src/main/java/com/example/empleados/api/DepartamentoController.java y src/main/java/com/example/empleados/config/SecurityConfig.java
- [ ] T026 [US3] Validar que CRUD de empleados/departamentos no cambia comportamiento fuera de autenticacion en src/main/java/com/example/empleados/service/EmpleadoService.java y src/main/java/com/example/empleados/service/DepartamentoService.java
- [X] T027 [US3] Documentar flujo operativo de migracion y continuidad en specs/001-empleados-email-auth/quickstart.md

**Checkpoint**: US3 confirma continuidad operativa del sistema bajo login por correo

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre transversal con consistencia documental y validacion final

- [X] T028 [P] Alinear contrato final y descripciones de seguridad por correo en specs/001-empleados-email-auth/contracts/empleados-email-auth.openapi.yaml y specs/001-empleados-email-auth/quickstart.md
- [X] T029 [P] Ajustar guia final con escenarios de backfill, bloqueo temporal y reemplazo por admin en specs/001-empleados-email-auth/quickstart.md
- [ ] T030 Ejecutar validacion manual E2E completa (login correo real, rechazo temporal, reemplazo admin, CRUD protegido) y registrar evidencia en specs/001-empleados-email-auth/quickstart.md
- [ ] T031 Ejecutar matriz cuantificada de autenticacion/validacion (minimo 30 casos) para evidenciar SC-001, SC-002 y SC-003 en specs/001-empleados-email-auth/quickstart.md
- [X] T032 Validar compilacion final sin pruebas (`mvn -q -DskipTests compile`) y registrar resultado en specs/001-empleados-email-auth/plan.md
- [ ] T033 Medir p95 de latencia sobre operaciones CRUD autenticadas (muestra minima de 100 solicitudes) y registrar metodologia + resultado en specs/001-empleados-email-auth/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea historias
- **US1 (Phase 3)**: depende de Foundational
- **US2 (Phase 4)**: depende de Foundational y de la base de autenticacion de US1
- **US3 (Phase 5)**: depende de US1 + US2 para validar continuidad completa
- **Polish (Phase 6)**: depende de historias objetivo completas

### User Story Dependencies (Completion Graph)

- **US1 (P1)**: base de autenticacion por correo
- **US2 (P2)**: depende de US1 para validar login con correo gestionado
- **US3 (P3)**: valida continuidad operativa sobre US1 y US2

Representacion:

`Setup -> Foundational -> US1 -> US2 -> US3 -> Polish`

### Within Each User Story

- Seguridad/servicio antes de controlador
- Controlador antes de contrato/documentacion final
- Cierre de historia con criterio de prueba independiente

### Parallel Opportunities

- **Setup**: T002 y T003 en paralelo
- **Foundational**: T005, T006, T007 y T009 en paralelo tras T004
- **Polish**: T028 y T029 en paralelo

---

## Parallel Example: User Story 1

```bash
Task: "T011 [US1] UserDetailsService por correo en src/main/java/com/example/empleados/service/EmpleadoUserDetailsService.java"
Task: "T014 [US1] OpenAPI security por correo en src/main/java/com/example/empleados/config/OpenApiConfig.java"
```

## Parallel Example: User Story 2

```bash
Task: "T016 [US2] Validacion de correo en DTOs en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java y src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java"
Task: "T023 [US2] Contrato OpenAPI con correo en specs/001-empleados-email-auth/contracts/empleados-email-auth.openapi.yaml"
```

## Parallel Example: User Story 3

```bash
Task: "T025 [US3] Compatibilidad seguridad departamentos en src/main/java/com/example/empleados/api/DepartamentoController.java y src/main/java/com/example/empleados/config/SecurityConfig.java"
Task: "T027 [US3] Flujo operativo documentado en specs/001-empleados-email-auth/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar Phase 3 (US1)
4. Validar autenticacion por correo de forma independiente
5. Demostrar MVP

### Incremental Delivery

1. Setup + Foundational
2. Entregar US1 (login por correo)
3. Entregar US2 (gestion de correo y reemplazo temporal)
4. Entregar US3 (continuidad operativa)
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
