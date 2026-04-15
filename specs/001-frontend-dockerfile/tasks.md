# Tasks: Frontend Dockerfile Startup

**Input**: Design documents from `/specs/001-frontend-dockerfile/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se incluyen tareas de test automatizado nuevas porque la especificacion no exige enfoque TDD; se incluyen validaciones operativas y evidencia de criterios de exito.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estructura base para contenedorizacion del frontend.

- [X] T001 Create frontend Docker support directory in frontend/docker/startup/
- [X] T002 [P] Create frontend Docker ignore rules in frontend/.dockerignore
- [X] T003 [P] Create frontend runtime env example for container execution in frontend/.env.docker.example
- [X] T004 Create startup helper script scaffold for container runtime in frontend/docker/startup/start-frontend.sh

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura bloqueante para configuracion runtime, fail-fast y politicas comunes.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement runtime config model for API and port variables in frontend/src/app/core/config/runtime-config.model.ts
- [X] T006 [P] Implement runtime config loader service in frontend/src/app/core/config/runtime-config.service.ts
- [X] T007 Refactor API base URL provider to use runtime config source in frontend/src/app/core/config/api.config.ts
- [X] T008 Register APP_INITIALIZER for runtime config bootstrap in frontend/src/app/app.config.ts
- [X] T009 Implement fail-fast behavior when API_BASE_URL is missing in frontend/docker/startup/start-frontend.sh
- [X] T010 Define bounded restart policy defaults in frontend/.env.docker.example

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Iniciar Frontend En Contenedor (Priority: P1) 🎯 MVP

**Goal**: Construir y ejecutar el frontend en contenedor usando `ng serve` con puerto configurable.

**Independent Test**: Ejecutar `docker build -f frontend/Dockerfile -t empleados-frontend:local frontend` y `docker run -p 4200:4200 -e API_BASE_URL=http://localhost:8080 --restart on-failure:3 empleados-frontend:local`; validar UI accesible.

### Implementation for User Story 1

- [X] T011 [US1] Create frontend Dockerfile for ng serve runtime in frontend/Dockerfile
- [X] T012 [P] [US1] Wire startup helper script into image entrypoint in frontend/Dockerfile
- [X] T013 [US1] Configure ng serve host and configurable port startup command in frontend/package.json
- [X] T014 [US1] Document Docker build and run commands for default port flow in specs/001-frontend-dockerfile/quickstart.md
- [X] T015 [US1] Document port-conflict troubleshooting and alternate FRONTEND_PORT run flow in specs/001-frontend-dockerfile/quickstart.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Integracion Con API En Contenedor (Priority: P2)

**Goal**: Garantizar que el frontend en contenedor consuma API configurada en runtime sin cambios de codigo.

**Independent Test**: Iniciar contenedor frontend con `API_BASE_URL` valida, realizar login y lectura autenticada en UI, luego ejecutar inicio sin `API_BASE_URL` y validar fallo inmediato con mensaje claro.

### Implementation for User Story 2

- [X] T016 [US2] Implement API_BASE_URL mandatory runtime resolution in frontend/src/app/core/config/runtime-config.service.ts
- [X] T017 [P] [US2] Update API token factory to consume runtime configuration in frontend/src/app/core/config/api.config.ts
- [X] T018 [US2] Ensure bootstrap waits for runtime config before app starts in frontend/src/app/app.config.ts
- [X] T019 [US2] Add API unavailable mapping for runtime connectivity errors in frontend/src/app/core/http/api-error.mapper.ts
- [X] T020 [US2] Surface API unavailability guidance in UI shell in frontend/src/app/app.html
- [X] T021 [US2] Document login and authenticated read verification steps for container run in specs/001-frontend-dockerfile/quickstart.md
- [X] T022 [US2] Document fail-fast expected output when API_BASE_URL is missing in specs/001-frontend-dockerfile/quickstart.md

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Operacion Documentada Del Contenedor (Priority: P3)

**Goal**: Entregar guia operativa reproducible para onboarding y soporte interno del frontend contenedorizado.

**Independent Test**: Una persona nueva sigue la documentacion y logra build/run/stop del contenedor frontend sin asistencia.

### Implementation for User Story 3

- [X] T023 [US3] Validate and refine frontend Docker runtime contract alignment with clarifications in specs/001-frontend-dockerfile/contracts/frontend-dockerfile-runtime.contract.yaml
- [X] T024 [US3] Create dedicated frontend Docker runbook for onboarding in docs/frontend-dockerfile-runbook.md
- [X] T025 [P] [US3] Update frontend contributor docs with Docker usage in frontend/README.md
- [X] T026 [US3] Add startup and shutdown reproducibility checklist in specs/001-frontend-dockerfile/quickstart.md
- [X] T027 [US3] Document bounded restart policy behavior and limits in specs/001-frontend-dockerfile/quickstart.md

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validaciones finales de criterios de exito y no-regresion.

- [ ] T028 [P] Capture 10 consecutive Docker build results and record SC-001 evidence in specs/001-frontend-dockerfile/quickstart.md
- [ ] T029 [P] Capture 20 container startup timing results and record SC-002 evidence in specs/001-frontend-dockerfile/quickstart.md
- [ ] T030 Record SC-003 login plus authenticated-read success rate evidence in specs/001-frontend-dockerfile/quickstart.md
- [ ] T031 Record SC-004 onboarding trial outcomes for at least two team members in specs/001-frontend-dockerfile/quickstart.md
- [ ] T032 Validate Basic Auth baseline credential compatibility during containerized frontend flow in specs/001-frontend-dockerfile/quickstart.md
- [ ] T033 Validate Swagger/OpenAPI non-regression accessibility after frontend container run in specs/001-frontend-dockerfile/quickstart.md
- [X] T034 Create API deprecation and migration policy reference document in docs/api-deprecation-policy.md
- [X] T035 Validate optional-compose scope boundary and record acceptance note in specs/001-frontend-dockerfile/quickstart.md
- [ ] T036 Validate backend baseline runtime non-regression (Spring Boot 3.x and Java 17) and record evidence in specs/001-frontend-dockerfile/quickstart.md
- [ ] T037 Validate PostgreSQL persistence non-regression during frontend containerized flow and record evidence in specs/001-frontend-dockerfile/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and delivers MVP container startup
- **User Story 2 (P2)**: Starts after Foundational and integrates runtime API behavior on top of US1
- **User Story 3 (P3)**: Starts after US1 and US2 to document final behavior accurately

### Within Each User Story

- Runtime/config prerequisites before startup commands
- Startup path before API integration checks
- Behavior implementation before documentation evidence

### Dependency Graph (Story Completion Order)

- `US1 -> US2 -> US3`

---

## Parallel Execution Examples

### User Story 1

```bash
Task T012 in frontend/Dockerfile
Task T013 in frontend/package.json
```

### User Story 2

```bash
Task T017 in frontend/src/app/core/config/api.config.ts
Task T019 in frontend/src/app/core/http/api-error.mapper.ts
```

### User Story 3

```bash
Task T025 in frontend/README.md
Task T027 in specs/001-frontend-dockerfile/quickstart.md
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate startup independently
5. Demo Dockerfile startup capability

### Incremental Delivery

1. Setup + Foundational as stable baseline
2. Deliver US1 for container startup MVP
3. Deliver US2 for runtime API integration behavior
4. Deliver US3 for operational documentation
5. Execute Polish validations and capture SC evidence

### Parallel Team Strategy

1. Team finalizes Setup and Foundational together
2. Then split by concern:
   - Developer A: Dockerfile and startup scripts
   - Developer B: Runtime config and API integration
   - Developer C: Documentation and evidence capture
3. Merge by story checkpoints

---

## Notes

- [P] tasks target separate files and can run concurrently.
- Story labels ensure end-to-end traceability by user story.
- Every task includes explicit file path and executable intent.
- MVP scope recommendation: **US1 only**.
