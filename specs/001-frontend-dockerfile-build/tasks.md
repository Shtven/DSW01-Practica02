# Tasks: Frontend Dockerfile Simplification

**Input**: Design documents from `/specs/001-frontend-dockerfile-build/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/frontend-compose.contract.yaml, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare implementation baseline and shared artifacts for this feature.

- [X] T001 Validate implementation baseline and update scope notes in specs/001-frontend-dockerfile-build/plan.md
- [X] T002 [P] Normalize frontend runtime env examples in frontend/.env.docker.example
- [X] T003 [P] Create implementation evidence log scaffold in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md
- [X] T004 Capture expected compose contract checkpoints in specs/001-frontend-dockerfile-build/contracts/frontend-compose.contract.yaml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core prerequisites required before user story work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Refactor frontend container entry strategy references in frontend/Dockerfile
- [X] T006 [P] Introduce runtime web-server config path outside deleted folder in frontend/nginx/default.conf.template
- [X] T007 [P] Introduce runtime startup script path outside deleted folder in frontend/nginx/docker-entrypoint.sh
- [X] T008 Align runtime config template contract in frontend/public/runtime-config.template.json
- [X] T009 Update compose runtime variable contract and service defaults in docker/compose.yml
- [X] T010 [P] Align quickstart command contract with required runtime env in specs/001-frontend-dockerfile-build/quickstart.md

**Checkpoint**: Foundational readiness complete.

---

## Phase 3: User Story 1 - Build Frontend Image with One Dockerfile (Priority: P1) 🎯 MVP

**Goal**: Build frontend image from a single Dockerfile with no dependency on frontend/docker.

**Independent Test**: Run `docker build -f frontend/Dockerfile -t empleados-frontend:local frontend` and verify success without any reference to frontend/docker.

### Implementation for User Story 1

- [X] T011 [US1] Remove legacy folder assets in frontend/docker/nginx/default.conf.template
- [X] T012 [US1] Remove legacy folder assets in frontend/docker/nginx/docker-entrypoint.sh
- [X] T013 [US1] Remove legacy folder startup script in frontend/docker/startup/start-frontend.sh
- [X] T014 [US1] Remove empty legacy directories in frontend/docker/
- [X] T015 [US1] Update COPY and runtime references to new paths in frontend/Dockerfile
- [X] T016 [P] [US1] Adjust frontend build context exclusions in frontend/.dockerignore
- [X] T017 [US1] Record US1 build evidence and command output in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md

**Checkpoint**: User Story 1 is independently testable.

---

## Phase 4: User Story 2 - Keep Startup Behavior Predictable (Priority: P2)

**Goal**: Ensure deterministic runtime behavior with mandatory API_BASE_URL and compose defaults.

**Independent Test**: Start frontend container once with `API_BASE_URL` set and once missing it; verify running behavior and fail-fast behavior.

### Implementation for User Story 2

- [X] T018 [US2] Enforce mandatory runtime API variable check in frontend/nginx/docker-entrypoint.sh
- [X] T019 [US2] Ensure generated runtime config consumes API variable contract in frontend/public/runtime-config.template.json
- [X] T020 [US2] Update frontend runtime server template behavior in frontend/nginx/default.conf.template
- [X] T021 [US2] Remove implicit API default from compose frontend environment in docker/compose.yml
- [X] T022 [US2] Keep frontend host exposure default at 4200 in docker/compose.yml
- [X] T023 [US2] Keep backend and postgres internal-only defaults in docker/compose.yml
- [X] T024 [US2] Record US2 startup/fail-fast evidence in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md
- [X] T024A [US2] Measure and record fail-fast wall-clock time without API_BASE_URL (target <=30s) in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md

**Checkpoint**: User Story 2 is independently testable.

---

## Phase 5: User Story 3 - Keep Documentation Aligned (Priority: P3)

**Goal**: Align docs with new folder structure and runtime behavior.

**Independent Test**: Follow docs only and verify user can build and run without consulting removed folder paths.

### Implementation for User Story 3

- [X] T025 [US3] Update container runtime section and commands in frontend/README.md
- [X] T026 [US3] Remove references to frontend/docker paths from docs/frontend-dockerfile-runbook.md
- [X] T027 [US3] Align compose defaults and exposure notes in specs/001-frontend-dockerfile-build/quickstart.md
- [X] T028 [US3] Add migration note for removed folder and new paths in docs/frontend-dockerfile-runbook.md
- [X] T029 [P] [US3] Cross-check deprecation guidance linkage in docs/api-deprecation-policy.md
- [X] T030 [US3] Record documentation validation evidence in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md

**Checkpoint**: User Story 3 is independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and consistency checks across stories.

- [X] T031 [P] Run full compose configuration validation and capture output in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md
- [X] T032 Validate no-regression checks for Basic Auth, /api/v1/* and Swagger/OpenAPI in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md
- [X] T033 [P] Run docs reference sweep for removed path markers and capture findings in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md
- [X] T034 Finalize contract-to-implementation traceability updates in specs/001-frontend-dockerfile-build/contracts/frontend-compose.contract.yaml
- [X] T035 Mark completion summary and residual risks in specs/001-frontend-dockerfile-build/checklists/implementation-evidence.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): no dependencies.
- Foundational (Phase 2): depends on Setup and blocks all user stories.
- User Stories (Phase 3-5): depend on Foundational completion.
- Polish (Phase 6): depends on completed user stories.

### User Story Dependencies

- US1 (P1): starts immediately after Phase 2 and delivers MVP.
- US2 (P2): starts after Phase 2; validates runtime behavior and compose defaults.
- US3 (P3): starts after Phase 2; depends on final behavior from US1/US2 for doc accuracy.

### Within Each User Story

- Structural changes first.
- Runtime and compose alignment second.
- Evidence capture last.

### Parallel Opportunities

- T002 and T003 can run in parallel.
- T006 and T007 can run in parallel.
- In US1, T016 can run in parallel with T015 after deletions.
- In US3, T029 can run in parallel with T025-T028.
- In Polish, T031 and T033 can run in parallel.

---

## Parallel Example: User Story 1

- Task T015: Update runtime references in frontend/Dockerfile.
- Task T016: Adjust exclusions in frontend/.dockerignore.

---

## Parallel Example: User Story 2

- Task T019: Update runtime-config template in frontend/public/runtime-config.template.json.
- Task T021: Remove implicit API default in docker/compose.yml.

---

## Parallel Example: User Story 3

- Task T025: Update runtime instructions in frontend/README.md.
- Task T029: Cross-check deprecation policy linkage in docs/api-deprecation-policy.md.

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate independent test for US1.
4. Demo/build handoff.

### Incremental Delivery

1. Deliver US1 (single Dockerfile and folder removal).
2. Deliver US2 (runtime determinism and compose policy).
3. Deliver US3 (documentation alignment).
4. Run final polish checks.

### Parallel Team Strategy

1. One developer handles structural/container tasks (US1).
2. One developer handles runtime/compose behavior (US2).
3. One developer handles docs and policy validation (US3).
