# Tasks: Frontend Docker Compose Integration

**Input**: Design documents from `/specs/001-frontend-dockerfile-compose/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se agregan tareas de test automatizado nuevas porque la especificacion no exige TDD ni nuevas suites; se incluyen tareas de validacion operativa, no-regresion y criterios independientes por historia.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estructura base para contenerizacion del frontend y configuracion runtime.

- [ ] T001 Create frontend container support directories for Nginx and startup scripts in frontend/docker/
- [ ] T002 [P] Create Nginx template configuration for SPA serving and runtime env injection in frontend/docker/nginx/default.conf.template
- [ ] T003 [P] Create frontend container startup script for runtime config injection in frontend/docker/entrypoint.sh
- [ ] T004 Add runtime config template artifact consumed by Nginx startup in frontend/public/runtime-config.template.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura bloqueante para coordinar arranque del stack y politicas de red/puertos.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Add Spring Boot actuator dependency for deterministic health checks in pom.xml
- [ ] T006 Configure health endpoint exposure and readiness defaults in src/main/resources/application.properties
- [ ] T007 [P] Extend compose with backend healthcheck and service_healthy dependency semantics in docker/compose.yml
- [ ] T008 Enforce host port exposure policy (frontend only) and internal networking defaults in docker/compose.yml
- [ ] T009 [P] Add compose-level environment defaults for frontend runtime API URL in docker/compose.yml

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Levantar Todo El Entorno (Priority: P1) 🎯 MVP

**Goal**: Levantar frontend, backend y base de datos con un solo comando de orquestacion.

**Independent Test**: En entorno limpio, ejecutar `docker compose -f docker/compose.yml up -d --build` y verificar `frontend`, `app` y `postgres` en estado operativo sin pasos manuales adicionales.

### Implementation for User Story 1

- [ ] T010 [US1] Add frontend service definition (build, image, ports, depends_on) in docker/compose.yml
- [ ] T011 [P] [US1] Add .dockerignore optimized for Angular container build context in frontend/.dockerignore
- [ ] T012 [US1] Configure multi-stage Angular build and Nginx runtime image in frontend/Dockerfile
- [ ] T013 [US1] Wire Nginx template and entrypoint assets into frontend image in frontend/Dockerfile
- [ ] T014 [US1] Document one-command startup and expected service states for MVP path in specs/001-frontend-dockerfile-compose/quickstart.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Consumo Frontend En Entorno Orquestado (Priority: P2)

**Goal**: Garantizar conectividad frontend->backend dentro de compose con manejo claro de indisponibilidad temporal.

**Independent Test**: Con stack arriba, autenticarse en la UI y ejecutar un flujo de lectura/escritura contra `/api/v1/*`; simular caida temporal del backend y confirmar mensaje claro con reintento automatico.

### Implementation for User Story 2

- [ ] T015 [US2] Add runtime config loader service for browser startup in frontend/src/app/core/config/runtime-config.service.ts
- [ ] T016 [US2] Add runtime config model and injection token definitions in frontend/src/app/core/config/runtime-config.model.ts
- [ ] T017 [US2] Refactor API base URL provider to prioritize runtime config over static environment in frontend/src/app/core/config/api.config.ts
- [ ] T018 [US2] Register runtime config APP_INITIALIZER in frontend/src/app/app.config.ts
- [ ] T019 [P] [US2] Add generated runtime config JSON target path and fallback defaults in frontend/public/runtime-config.json
- [ ] T020 [US2] Harden GET retry behavior with bounded linear backoff (300ms and 600ms) for transient backend failures in frontend/src/app/core/http/retry-get.interceptor.ts
- [ ] T021 [US2] Add user-facing backend unavailable status mapping for connectivity failures in frontend/src/app/core/http/api-error.mapper.ts
- [ ] T022 [US2] Surface backend-unavailable status message in shared UI shell in frontend/src/app/app.html
- [ ] T036 [US2] Capture authenticated write-flow validation evidence (request, response, UI result) in specs/001-frontend-dockerfile-compose/quickstart.md

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Operacion Y Mantenimiento Simplificados (Priority: P3)

**Goal**: Dejar guia operativa estable para onboarding y mantenimiento de compose.

**Independent Test**: Un integrante del equipo sigue la documentacion desde cero y logra levantar, validar y detener el stack completo sin ayuda directa.

### Implementation for User Story 3

- [ ] T023 [US3] Update operational contract with final service ports, healthcheck command, and dependency order in specs/001-frontend-dockerfile-compose/contracts/docker-compose-stack.contract.yaml
- [ ] T024 [US3] Add onboarding-oriented runbook sections (prereqs, troubleshooting, restart behavior) in specs/001-frontend-dockerfile-compose/quickstart.md
- [ ] T025 [P] [US3] Document compose usage and frontend container behavior for contributors in frontend/README.md
- [ ] T026 [US3] Add repository-level local env example for compose variables in docker/.env.example

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validaciones finales y consistencia transversal del cambio.

- [ ] T027 [P] Verify Docker stack startup/shutdown flow and expected health states in specs/001-frontend-dockerfile-compose/quickstart.md
- [ ] T028 Validate no backend API contract regression while running frontend in compose by checking specs/001-frontend-dockerfile-compose/contracts/docker-compose-stack.contract.yaml
- [ ] T029 [P] Run Angular production build validation command and record outcome in specs/001-frontend-dockerfile-compose/quickstart.md
- [ ] T030 Validate compose security posture (frontend-only host exposure) and capture final notes in specs/001-frontend-dockerfile-compose/quickstart.md
- [ ] T031 Validate Basic Auth baseline or equivalent local admin credential behavior and document evidence in specs/001-frontend-dockerfile-compose/quickstart.md
- [ ] T032 Validate Swagger/OpenAPI non-regression (availability and paths) and record evidence in specs/001-frontend-dockerfile-compose/quickstart.md
- [ ] T033 Create API deprecation and breaking-change migration policy document in docs/api-deprecation-policy.md
- [ ] T034 [P] Capture baseline startup-time measurements for previous workflow and record dataset in specs/001-frontend-dockerfile-compose/quickstart.md
- [ ] T035 Capture post-change startup-time measurements, compute median reduction, and record SC-003 result in specs/001-frontend-dockerfile-compose/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on completion of all user story phases

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and delivers MVP startup path
- **User Story 2 (P2)**: Starts after Foundational; depends on US1 frontend service artifacts for runtime behavior validation
- **User Story 3 (P3)**: Starts after US1 and US2 implementation details are stable to avoid documentation drift

### Within Each User Story

- Infrastructure wiring before service startup validation
- Runtime config plumbing before API client integration
- Error/retry handling before UX messaging finalization
- Documentation updates after behavior is implemented and verified

### Dependency Graph (Story Completion Order)

- `US1 -> US2 -> US3`

---

## Parallel Execution Examples

### User Story 1

```bash
Task T011 in frontend/.dockerignore
Task T012 in frontend/Dockerfile
```

### User Story 2

```bash
Task T019 in frontend/public/runtime-config.json
Task T020 in frontend/src/app/core/http/retry-get.interceptor.ts
```

### User Story 3

```bash
Task T025 in frontend/README.md
Task T026 in docker/.env.example
```

### Cross-Cutting Validation

```bash
Task T034 in specs/001-frontend-dockerfile-compose/quickstart.md
Task T033 in docs/api-deprecation-policy.md
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate one-command startup in clean environment
5. Demo MVP startup flow

### Incremental Delivery

1. Setup + Foundational for stable stack baseline
2. Deliver US1 (containerized frontend startup)
3. Deliver US2 (runtime API config + resiliencia en UI)
4. Deliver US3 (onboarding/operations documentation)
5. Execute Polish phase and finalize evidence

### Parallel Team Strategy

1. Team completes Phases 1 and 2 together
2. Then parallelize by file ownership:
   - Dev A: Compose and Dockerfile tasks (US1)
   - Dev B: Runtime config and retry UX tasks (US2)
   - Dev C: Contract + docs tasks (US3)
3. Merge by story checkpoints and run final polish validations

---

## Notes

- [P] tasks target different files and can be executed concurrently.
- Story labels map each task to a specific user story for traceability.
- Every task includes an explicit file path to make execution deterministic.
- MVP scope recommendation: **US1 only**.
