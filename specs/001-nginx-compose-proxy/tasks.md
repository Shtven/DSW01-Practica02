# Tasks: Nginx Compose Proxy Integration

**Input**: Design documents from `/specs/001-nginx-compose-proxy/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se agregan tareas de pruebas automatizadas porque no fueron solicitadas explicitamente en la especificacion. Se incluyen validaciones operativas y de no-regresion por historia.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estructura base de ingress Nginx y artefactos de apoyo para compose.

- [X] T001 Crear estructura base de proxy ingress en frontend/nginx/default.conf.template
- [X] T002 [P] Crear archivo base de entorno compose para ingress en docker/.env.example
- [X] T003 [P] Registrar seccion inicial de runbook de proxy en docs/frontend-dockerfile-runbook.md
- [X] T004 Crear seccion de evidencia para feature en specs/001-nginx-compose-proxy/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir comportamiento transversal del gateway y politicas de exposicion interna.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Ajustar politica de exposicion de servicios para ingress unico en docker/compose.yml
- [X] T006 Definir servicio Nginx gateway y red interna compose en docker/compose.yml
- [X] T007 [P] Implementar reglas base de frontend `/` y API `/api/*` en frontend/nginx/default.conf.template
- [X] T008 Implementar preservacion de rutas versionadas `/api/v1/*` en frontend/nginx/default.conf.template
- [X] T009 Documentar contrato operativo del gateway en specs/001-nginx-compose-proxy/contracts/nginx-compose-proxy.contract.yaml
- [X] T010 Definir verificacion de no-regresion de OpenAPI y Basic Auth en specs/001-nginx-compose-proxy/quickstart.md
- [X] T032 Ejecutar verificacion explicita de cumplimiento constitucional pre-implementacion (spec/plan/tasks) y registrar resultado en specs/001-nginx-compose-proxy/quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Arranque Unico Con Nginx (Priority: P1) 🎯 MVP

**Goal**: Levantar el stack completo con Nginx como punto de entrada unico publico.

**Independent Test**: Ejecutar `docker compose -f docker/compose.yml up -d --build` y validar que Nginx, app y postgres quedan operativos con acceso publico unicamente por Nginx.

### Implementation for User Story 1

- [X] T011 [US1] Configurar dependencia de arranque de Nginx hacia backend saludable en docker/compose.yml
- [X] T012 [US1] Configurar puerto publico del gateway Nginx en docker/compose.yml
- [X] T013 [US1] Mantener backend sin publicacion de host por defecto en docker/compose.yml
- [X] T014 [US1] Mantener PostgreSQL sin publicacion de host por defecto en docker/compose.yml
- [X] T015 [US1] Documentar procedimiento de arranque/parada de stack con ingress unico en specs/001-nginx-compose-proxy/quickstart.md
- [X] T016 [US1] Registrar evidencia de arranque exitoso 10/10 en specs/001-nginx-compose-proxy/quickstart.md

**Checkpoint**: User Story 1 completa y validable de forma independiente.

---

## Phase 4: User Story 2 - Proxy Hacia API (Priority: P2)

**Goal**: Enrutar solicitudes de API por Nginx hacia backend interno preservando seguridad y versionado.

**Independent Test**: Invocar `/api/v1/*` via endpoint publico de Nginx y confirmar respuestas esperadas para casos autenticados y no autenticados.

### Implementation for User Story 2

- [X] T017 [US2] Implementar bloque de proxy `/api/*` hacia upstream `app:8080` en frontend/nginx/default.conf.template
- [X] T018 [US2] Implementar forwarding de cabeceras requeridas para proxy HTTP en frontend/nginx/default.conf.template
- [X] T019 [US2] Preservar semantica de autenticacion Basic Auth a traves del proxy en frontend/nginx/default.conf.template
- [X] T020 [US2] Validar rutas protegidas y no protegidas via proxy en specs/001-nginx-compose-proxy/quickstart.md
- [X] T021 [US2] Validar preservacion de `/api/v1/*` y disponibilidad de `/v3/api-docs` via proxy en specs/001-nginx-compose-proxy/quickstart.md
- [X] T022 [US2] Registrar evidencia de tasa de exito >=95% en solicitudes API via proxy en specs/001-nginx-compose-proxy/quickstart.md

**Checkpoint**: User Story 2 funcional de forma independiente sobre la base del gateway.

---

## Phase 5: User Story 3 - Operacion Documentada Del Proxy (Priority: P3)

**Goal**: Proveer guia reproducible para que cualquier integrante opere el stack con Nginx proxy.

**Independent Test**: Un integrante nuevo ejecuta la guia y logra levantar, validar proxy y detener stack sin soporte directo.

### Implementation for User Story 3

- [X] T023 [US3] Completar runbook operativo de proxy (startup, validacion, shutdown) en docs/frontend-dockerfile-runbook.md
- [X] T024 [US3] Agregar troubleshooting de fallos de upstream y puertos en specs/001-nginx-compose-proxy/quickstart.md
- [X] T025 [US3] Vincular politica de deprecacion API al flujo con proxy en docs/api-deprecation-policy.md
- [X] T026 [US3] Registrar evidencia de onboarding 2/2 exitoso en specs/001-nginx-compose-proxy/quickstart.md

**Checkpoint**: User Story 3 completa con operacion documentada y verificable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de consistencia, robustez de comportamiento degradado y trazabilidad final.

- [X] T027 [P] Implementar respuesta de error controlado para `/api/*` cuando backend no disponible en frontend/nginx/default.conf.template (HTTP 502/503 + payload JSON machine-readable con campos `status`, `error`, `message`, `path`)
- [X] T028 [P] Verificar que frontend `/` permanece disponible en degradacion de backend en specs/001-nginx-compose-proxy/quickstart.md
- [X] T029 Validar alineacion final del contrato con implementacion en specs/001-nginx-compose-proxy/contracts/nginx-compose-proxy.contract.yaml
- [X] T030 Ejecutar validacion integral de quickstart y actualizar resultados finales en specs/001-nginx-compose-proxy/quickstart.md
- [X] T031 Consolidar resumen de cumplimiento SC-001..SC-004 en specs/001-nginx-compose-proxy/quickstart.md
- [X] T033 Validar no-regresion de runtime backend (Spring Boot 3.x y Java 17) y registrar evidencia en specs/001-nginx-compose-proxy/quickstart.md
- [X] T034 Validar no-regresion de baseline frontend (Angular 21) y registrar evidencia en specs/001-nginx-compose-proxy/quickstart.md
- [X] T035 Validar no-regresion de persistencia PostgreSQL en flujo con proxy y registrar evidencia en specs/001-nginx-compose-proxy/quickstart.md
- [X] T036 Ejecutar verificacion explicita de cumplimiento constitucional pre-merge (spec/plan/tasks + evidencia) y registrar resultado en specs/001-nginx-compose-proxy/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sin dependencias.
- **Phase 2 (Foundational)**: depende de Phase 1; bloquea todas las historias.
- **Phase 3 (US1)**: depende de Phase 2.
- **Phase 4 (US2)**: depende de Phase 2 y reutiliza gateway de US1.
- **Phase 5 (US3)**: depende de Phase 2 y de comportamiento estable de US1/US2.
- **Phase 6 (Polish)**: depende de historias completadas.

### User Story Completion Order

- **US1 (P1)** -> **US2 (P2)** -> **US3 (P3)**

### Dependency Graph

- **US1**: habilita entrada publica unica y topologia base.
- **US2**: agrega valor de enrutamiento API y seguridad sobre la base de US1.
- **US3**: consolida operacion reproducible sobre comportamiento definitivo.

---

## Parallel Execution Examples

### User Story 1

- Ejecutar en paralelo `T013` y `T015` una vez definido el servicio base de Nginx.

### User Story 2

- Ejecutar en paralelo `T018` y `T020` una vez completado `T017`.

### User Story 3

- Ejecutar en paralelo `T024` y `T025` despues de `T023`.

---

## Implementation Strategy

### MVP First (US1)

1. Completar Phase 1 y Phase 2.
2. Completar US1 (`T011`-`T016`).
3. Validar arranque unico con Nginx antes de continuar.

### Incremental Delivery

1. Entregar MVP con US1.
2. Agregar US2 para proxy API con no-regresion de seguridad/versionado.
3. Agregar US3 para operacion y onboarding.
4. Cerrar con Phase 6.

### Parallel Team Strategy

1. Equipo completo en Setup + Foundational.
2. Reparto por foco:
   - Dev A: compose y gateway base.
   - Dev B: reglas de proxy API y validaciones.
   - Dev C: runbook, troubleshooting y evidencia.
3. Integracion y cierre en Polish.

---

## Notes

- Las tareas con `[P]` son paralelizables dentro de su fase.
- Las tareas de historia incluyen etiqueta `[USx]` para trazabilidad directa con `spec.md`.
- Cada historia mantiene criterio de prueba independiente y ejecutable.
