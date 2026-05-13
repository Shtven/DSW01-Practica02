# Tasks: GitHub Workflow Front and Back Unit Tests

**Input**: Design documents from `/specs/001-github-workflow-tests/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se agregan tareas de nuevas pruebas automatizadas de aplicacion porque no fueron solicitadas con enfoque TDD; esta feature implementa y valida automatizacion CI de pruebas unitarias existentes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar la base del workflow CI y artefactos de soporte documental.

- [X] T001 Crear archivo base del workflow en .github/workflows/unit-tests.yml
- [X] T002 [P] Agregar seccion inicial de verificacion de CI en specs/001-github-workflow-tests/quickstart.md
- [X] T003 [P] Registrar metadatos iniciales del workflow en specs/001-github-workflow-tests/contracts/github-workflow-tests.contract.yaml
- [X] T004 Crear seccion de evidencia SC-001..SC-004 en specs/001-github-workflow-tests/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir comportamiento transversal obligatorio del workflow antes de implementar historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Crear estructura base del workflow (name, on, jobs placeholder) en .github/workflows/unit-tests.yml.
- [X] T006 Definir placeholders de filtros de ramas para push y pull_request en .github/workflows/unit-tests.yml.
- [X] T007 Definir permisos minimos globales (`contents: read`) en .github/workflows/unit-tests.yml
- [X] T008 Configurar politica fail-fast habilitada para ejecucion del workflow en .github/workflows/unit-tests.yml
- [X] T009 Definir estructura base de dos jobs (`frontend-unit-tests` y `backend-unit-tests`) en .github/workflows/unit-tests.yml
- [X] T010 [P] Alinear contrato operacional con triggers, permisos y fail-fast en specs/001-github-workflow-tests/contracts/github-workflow-tests.contract.yaml
- [X] T011 Ejecutar verificacion explicita de cumplimiento constitucional pre-implementacion y registrar resultado en specs/001-github-workflow-tests/quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Validacion Automatica En Push y PR (Priority: P1) 🎯 MVP

**Goal**: Disparar automaticamente el workflow en push y pull request para ramas `master` y `develop`.

**Independent Test**: Hacer push a rama objetivo y abrir PR hacia `master` o `develop`; confirmar que el workflow se ejecuta automaticamente.

### Implementation for User Story 1

- [X] T012 [US1] Aplicar trigger push para master y develop.
- [X] T013 [US1] Aplicar trigger pull_request para master y develop.
- [ ] T014 [US1] Validar que ramas fuera de alcance no disparan workflow y documentar evidencia en specs/001-github-workflow-tests/quickstart.md
- [X] T015 [US1] Documentar procedimiento de validacion de trigger en push y PR en specs/001-github-workflow-tests/quickstart.md
- [ ] T016 [US1] Registrar evidencia de cumplimiento SC-001 y SC-002 en specs/001-github-workflow-tests/quickstart.md

**Checkpoint**: User Story 1 completa y validable de forma independiente.

---

## Phase 4: User Story 2 - Pruebas Unitarias Separadas Por Capa (Priority: P2)

**Goal**: Ejecutar pruebas unitarias de frontend y backend en jobs separados con runtime y comandos definidos.

**Independent Test**: Ejecutar workflow y confirmar dos jobs separados, frontend en Node LTS y backend en Java 17, cada uno con comando directo.

### Implementation for User Story 2

- [X] T017 [US2] Implementar job `frontend-unit-tests` con runtime Node LTS en .github/workflows/unit-tests.yml
- [X] T018 [US2] Implementar comando directo de pruebas frontend (`npm test`) en .github/workflows/unit-tests.yml
- [X] T019 [US2] Implementar job `backend-unit-tests` con runtime Java 17 en .github/workflows/unit-tests.yml
- [X] T020 [US2] Implementar comando directo de pruebas backend (`mvn -B test`) en .github/workflows/unit-tests.yml
- [X] T021 [US2] Configurar pasos de checkout e inicializacion por job en .github/workflows/unit-tests.yml
- [X] T022 [US2] Alinear contrato con separacion de jobs y runtimes en specs/001-github-workflow-tests/contracts/github-workflow-tests.contract.yaml
- [ ] T023 [US2] Documentar validacion de jobs separados y runtimes en specs/001-github-workflow-tests/quickstart.md
- [ ] T024 [US2] Registrar evidencia de cumplimiento SC-003 en specs/001-github-workflow-tests/quickstart.md

**Checkpoint**: User Story 2 funcional de forma independiente sobre la base de triggers.

---

## Phase 5: User Story 3 - Retroalimentacion Clara Para Revision de Cambios (Priority: P3)

**Goal**: Proveer resultados de ejecucion claros para revision de PR, incluyendo comportamiento ante fallos.

**Independent Test**: Forzar una falla en una sola capa y comprobar que el workflow finaliza fallido y que jobs pendientes pueden cancelarse por fail-fast.

### Implementation for User Story 3

- [X] T025 [US3] Configurar fallo global del workflow cuando falle cualquier job de pruebas.
- [X] T026 [US3] Configurar bloqueo de validaciones dependientes posteriores ante fallo (estrategia fail-fast operativa).
- [X] T027 [US3] Definir nombres y rotulos claros de jobs para revision de PR en .github/workflows/unit-tests.yml
- [ ] T028 [US3] Documentar escenario de falla intencional por capa y resultado esperado en specs/001-github-workflow-tests/quickstart.md
- [ ] T029 [US3] Registrar evidencia de cumplimiento SC-004 en specs/001-github-workflow-tests/quickstart.md

**Checkpoint**: User Story 3 completa con feedback claro para revision de cambios.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de consistencia contractual, validacion integral y trazabilidad final.

- [X] T030 [P] Validar consistencia final workflow-contrato en specs/001-github-workflow-tests/contracts/github-workflow-tests.contract.yaml
- [ ] T031 Ejecutar validacion integral de quickstart y actualizar resultados finales en specs/001-github-workflow-tests/quickstart.md
- [ ] T032 Consolidar resumen de cumplimiento SC-001..SC-004 en specs/001-github-workflow-tests/quickstart.md
- [X] T033 Validar no-regresion de baseline backend (Java 17 / Spring Boot 3.x) en contexto CI y registrar evidencia en specs/001-github-workflow-tests/quickstart.md
- [X] T034 Validar no-regresion de baseline frontend (Angular 21 / Node LTS para tests) y registrar evidencia en specs/001-github-workflow-tests/quickstart.md
- [ ] T035 Ejecutar verificacion explicita de cumplimiento constitucional pre-merge y registrar resultado en specs/001-github-workflow-tests/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sin dependencias.
- **Phase 2 (Foundational)**: depende de Phase 1; bloquea todas las historias.
- **Phase 3 (US1)**: depende de Phase 2.
- **Phase 4 (US2)**: depende de Phase 2.
- **Phase 5 (US3)**: depende de Phase 2 y de jobs estables de US2.
- **Phase 6 (Polish)**: depende de historias completadas.

### User Story Completion Order

- **US1 (P1)** -> **US2 (P2)** -> **US3 (P3)**

### Dependency Graph

- **US1**: habilita activacion automatica en ramas objetivo.
- **US2**: aporta ejecucion real de pruebas por capa.
- **US3**: consolida legibilidad de resultados y manejo de fallos para revision.

---

## Parallel Execution Examples

### User Story 1

- Ejecutar en paralelo `T014` y `T015` una vez implementados `T012` y `T013`.

### User Story 2

- Ejecutar en paralelo `T018` y `T019` una vez definida la estructura de jobs en `T017`.

### User Story 3

- Ejecutar en paralelo `T027` y `T028` despues de `T025`.

---

## Implementation Strategy

### MVP First (US1)

1. Completar Phase 1 y Phase 2.
2. Completar US1 (`T012`-`T016`).
3. Validar disparo automatico en push/PR antes de continuar.

### Incremental Delivery

1. Entregar MVP con US1.
2. Agregar US2 para ejecucion separada de pruebas unitarias.
3. Agregar US3 para feedback claro de revision en PR.
4. Cerrar con Phase 6.

### Parallel Team Strategy

1. Equipo completo en Setup + Foundational.
2. Reparto por foco:
   - Dev A: triggers, permisos y fail-fast del workflow.
   - Dev B: jobs de frontend/backend y comandos directos.
   - Dev C: quickstart, contrato y evidencia de cumplimiento.
3. Integracion y cierre en Polish.

---

## Notes

- Las tareas con `[P]` son paralelizables dentro de su fase.
- Las tareas de historia incluyen etiqueta `[USx]` para trazabilidad directa con `spec.md`.
- Cada historia mantiene criterio de prueba independiente y ejecutable.
