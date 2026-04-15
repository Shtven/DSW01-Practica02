# Tasks: Frontend Dockerfile Compose Integration

**Input**: Design documents from `/specs/002-frontend-dockerfile-compose/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se agregan tareas de test automatizado nuevas porque la especificacion no exige enfoque TDD; se incluyen validaciones operativas y evidencia de criterios de exito.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar artefactos base para runtime estatico de frontend en compose.

- [ ] T001 Create frontend Nginx runtime directory in frontend/docker/nginx/
- [ ] T002 [P] Create Nginx site template for SPA and runtime config serving in frontend/docker/nginx/default.conf.template
- [ ] T003 [P] Create frontend runtime entrypoint script for env injection in frontend/docker/nginx/docker-entrypoint.sh
- [ ] T004 Create runtime config template for container startup substitution in frontend/public/runtime-config.template.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura bloqueante para startup ordenado, networking interno y no-regresion base.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Add Spring Boot actuator dependency for healthcheck support in pom.xml
- [ ] T006 Configure health endpoint exposure for compose probes in src/main/resources/application.properties
- [ ] T007 Refactor frontend container image to multi-stage Angular build plus Nginx runtime in frontend/Dockerfile
- [ ] T008 [P] Add frontend container ignore rules for optimized build context in frontend/.dockerignore
- [ ] T009 Wire runtime config template generation into Nginx entrypoint flow in frontend/docker/nginx/docker-entrypoint.sh
- [ ] T010 Add backend healthcheck definition and condition contract in docker/compose.yml
- [ ] T011 Enforce frontend-only host port exposure policy in docker/compose.yml
- [ ] T012 Configure frontend runtime API default to http://app:8080 in docker/compose.yml

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Arranque Unificado Del Stack (Priority: P1) 🎯 MVP

**Goal**: Levantar frontend, backend y base de datos con un solo comando compose de forma estable.

**Independent Test**: Ejecutar `docker compose -f docker/compose.yml up -d --build` desde entorno limpio y validar servicios `frontend`, `app` y `postgres` operativos con arranque ordenado.

### Implementation for User Story 1

- [ ] T013 [US1] Add frontend service definition (build, image, ports, depends_on healthy app) in docker/compose.yml
- [ ] T014 [P] [US1] Configure frontend service startup command and entrypoint wiring in docker/compose.yml
- [ ] T015 [US1] Remove default host publishing for backend service while preserving internal port in docker/compose.yml
- [ ] T016 [US1] Remove default host publishing for postgres service while preserving internal port in docker/compose.yml
- [ ] T040 [US1] Set and verify frontend default host port mapping 4200:80 in docker/compose.yml
- [ ] T041 [US1] Record default host URL verification (http://localhost:4200) in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T017 [US1] Update stack startup and shutdown commands for one-command workflow in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T018 [US1] Add expected service-state verification checklist for startup sequence in specs/002-frontend-dockerfile-compose/quickstart.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Flujo Funcional Frontend-API (Priority: P2)

**Goal**: Garantizar que frontend en compose consuma API interna y permita flujos autenticados sin reconfiguracion manual.

**Independent Test**: Con stack arriba, iniciar sesion en UI y ejecutar una lectura + una escritura autenticadas usando API versionada.

### Implementation for User Story 2

- [ ] T019 [US2] Update runtime config loading to prioritize container-injected values in frontend/src/app/core/config/runtime-config.service.ts
- [ ] T020 [P] [US2] Ensure API injection token resolves compose DNS default URL behavior in frontend/src/app/core/config/api.config.ts
- [ ] T021 [US2] Adjust app bootstrap initializer ordering for runtime config before API calls in frontend/src/app/app.config.ts
- [ ] T022 [US2] Update API connectivity error mapping for backend temporary unavailability in frontend/src/app/core/http/api-error.mapper.ts
- [ ] T023 [US2] Surface backend-unavailable recovery guidance in UI shell in frontend/src/app/app.html
- [ ] T038 [US2] Implement bounded retry/backoff for transient backend unavailability in frontend/src/app/core/http/retry-get.interceptor.ts
- [ ] T039 [US2] Record retry/backoff runtime behavior evidence in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T024 [US2] Document authenticated read and write validation steps in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T025 [US2] Document runtime API URL behavior (`http://app:8080`) and non-loopback constraint in specs/002-frontend-dockerfile-compose/quickstart.md

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Operacion Reproducible Para Equipo (Priority: P3)

**Goal**: Entregar documentacion operativa clara para onboarding y soporte del stack integrado.

**Independent Test**: Un integrante nuevo sigue documentacion y logra build/run/stop del stack sin asistencia.

### Implementation for User Story 3

- [ ] T026 [US3] Align operational contract with final compose ports, dependencies, and exposure policy in specs/002-frontend-dockerfile-compose/contracts/docker-compose-stack.contract.yaml
- [ ] T027 [US3] Update contributor-facing frontend compose usage and runtime notes in frontend/README.md
- [ ] T028 [P] [US3] Add compose environment example file with frontend runtime variables in docker/.env.example
- [ ] T029 [US3] Add troubleshooting matrix for startup order, API routing, and credentials in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T030 [US3] Validate and update deprecation/migration policy content for compose-integrated operation in docs/api-deprecation-policy.md
- [ ] T042 [US3] Link validated deprecation policy from specs/002-frontend-dockerfile-compose/quickstart.md

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validaciones finales de criterios de exito y no-regresion.

- [ ] T031 [P] Capture 10 consecutive one-command startup runs and log SC-001 evidence in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T032 [P] Capture 20 initial UI load attempts with authenticated read/write results for SC-002 in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T033 [P] Capture startup timing sample and compute SC-003 compliance in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T034 Record onboarding trial outcomes for at least two team members for SC-004 in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T035 Validate Swagger/OpenAPI non-regression accessibility while stack is running and record evidence in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T036 Validate backend behavior non-regression (Spring Boot 3.x / Java 17) in compose-integrated flow and record evidence in specs/002-frontend-dockerfile-compose/quickstart.md
- [ ] T037 Validate PostgreSQL persistence non-regression across stack restarts and record evidence in specs/002-frontend-dockerfile-compose/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on completion of all user story phases

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and delivers one-command startup MVP
- **User Story 2 (P2)**: Starts after Foundational and builds on stable orchestration from US1
- **User Story 3 (P3)**: Starts after US1 and US2 to document final operational behavior accurately

### Within Each User Story

- Compose/runtime wiring before operational verification
- Runtime config injection before UI/API behavior checks
- Behavior implementation before documentation evidence capture

### Dependency Graph (Story Completion Order)

- `US1 -> US2 -> US3`

---

## Parallel Execution Examples

### User Story 1

```bash
Task T014 in docker/compose.yml
Task T017 in specs/002-frontend-dockerfile-compose/quickstart.md
```

### User Story 2

```bash
Task T020 in frontend/src/app/core/config/api.config.ts
Task T022 in frontend/src/app/core/http/api-error.mapper.ts
```

### User Story 3

```bash
Task T028 in docker/.env.example
Task T029 in specs/002-frontend-dockerfile-compose/quickstart.md
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate startup independently
5. Demo one-command startup capability

### Incremental Delivery

1. Setup + Foundational establish stable compose baseline
2. Deliver US1 for startup orchestration MVP
3. Deliver US2 for functional frontend-to-API flow
4. Deliver US3 for reproducible team operations
5. Execute Polish phase and capture SC evidence

### Parallel Team Strategy

1. Team completes Setup and Foundational together
2. Then split by concern:
   - Developer A: Compose orchestration and backend health gating
   - Developer B: Frontend runtime config and API flow behavior
   - Developer C: Documentation, contract alignment, and evidence capture
3. Merge at story checkpoints

---

## Notes

- [P] tasks target separate files and can run concurrently.
- Story labels ensure traceability from tasks to user stories.
- Every task includes explicit file path and executable intent.
- MVP scope recommendation: **US1 only**.
