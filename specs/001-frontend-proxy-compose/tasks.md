# Tasks: Proxy Compose Solo Frontend Puerto 80

**Input**: Design documents from `/specs/001-frontend-proxy-compose/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/proxy-exposure-contract.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de trabajo y alinear documentación operativa al alcance del feature.

- [X] T001 Alinear objetivo de despliegue local a puerto publico 80 en specs/001-frontend-proxy-compose/quickstart.md
- [X] T002 [P] Alinear objetivo de gateway unico al puerto 80 en docs/frontend-dockerfile-runbook.md
- [X] T003 [P] Confirmar y documentar alcance sin TLS para esta iteracion en specs/001-frontend-proxy-compose/contracts/proxy-exposure-contract.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir la topologia de red base que bloquea todas las historias hasta quedar estable.

**⚠️ CRITICAL**: Ninguna historia de usuario inicia antes de completar esta fase.

- [X] T004 Fijar publicacion del gateway en puerto 80 del host en docker/compose.yml
- [X] T005 Eliminar configuracion de puerto host variable del gateway (NGINX_PORT) en docker/compose.yml
- [X] T006 Garantizar que app y postgres no publiquen puertos al host en docker/compose.yml
- [X] T007 Mantener los tres servicios en la red interna de Docker en docker/compose.yml
- [X] T008 Reemplazar fallback personalizado de errores por comportamiento HTTP estandar de proxy en frontend/nginx/default.conf.template

**Checkpoint**: Topologia base lista, se habilita implementacion por historia.

---

## Phase 3: User Story 1 - Acceso publico controlado al frontend (Priority: P1) 🎯 MVP

**Goal**: Exponer unicamente el frontend por `http://localhost:80` sin exponer servicios internos.

**Independent Test**: Levantar compose y verificar frontend en puerto 80 y ausencia de puertos publicados para app/postgres.

### Implementation for User Story 1

- [X] T009 [US1] Aplicar politica de exposicion unica (solo nginx publica puertos) en docker/compose.yml
- [X] T010 [US1] Validar contrato de exposicion de red con reglas finales en specs/001-frontend-proxy-compose/contracts/proxy-exposure-contract.md
- [X] T011 [US1] Actualizar pasos de verificacion de puertos expuestos en specs/001-frontend-proxy-compose/quickstart.md
- [X] T012 [US1] Actualizar runbook para reflejar que solo existe endpoint publico en docs/frontend-dockerfile-runbook.md

**Checkpoint**: US1 implementada y verificable de forma independiente.

---

## Phase 4: User Story 2 - Flujo funcional sin cambios para usuarios (Priority: P2)

**Goal**: Mantener el flujo funcional frontend/API a traves del proxy sin regresiones de comportamiento.

**Independent Test**: Ejecutar flujo funcional principal por `http://localhost:80` y confirmar enrutamiento `/api/*` al backend interno.

### Implementation for User Story 2

- [X] T013 [US2] Verificar y ajustar regla de enrutamiento SPA para `/` y fallback a `index.html` en frontend/nginx/default.conf.template
- [X] T014 [US2] Verificar y ajustar forwarding de `/api/` hacia `app:8080` en frontend/nginx/default.conf.template
- [X] T015 [P] [US2] Asegurar base URL de API por proxy (`/api`) en docker/compose.yml
- [X] T016 [US2] Actualizar validaciones funcionales de API via proxy en docs/frontend-dockerfile-runbook.md
- [X] T017 [US2] Actualizar expectativa de degradacion a HTTP estandar 502/504 en specs/001-frontend-proxy-compose/quickstart.md

**Checkpoint**: US1 y US2 funcionales y comprobables por separado.

---

## Phase 5: User Story 3 - Experiencia local simple para el equipo (Priority: P3)

**Goal**: Simplificar arranque, troubleshooting y demostracion local con un unico endpoint publico.

**Independent Test**: Seguir quickstart desde entorno limpio y completar el flujo sin pasos ocultos.

### Implementation for User Story 3

- [X] T018 [US3] Documentar flujo de arranque/parada minimo para el equipo en specs/001-frontend-proxy-compose/quickstart.md
- [X] T019 [P] [US3] Documentar manejo de conflicto de puerto 80 en specs/001-frontend-proxy-compose/quickstart.md
- [X] T020 [US3] Documentar checklist de operacion diaria con endpoint unico en docs/frontend-dockerfile-runbook.md
- [X] T021 [US3] Incluir validacion explicita de servicios internos no expuestos en docs/frontend-dockerfile-runbook.md

**Checkpoint**: US3 completa con experiencia de uso local consistente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar consistencia y verificacion final del feature completo.

- [ ] T022 [P] Ejecutar validacion final de comandos de quickstart y ajustar evidencias en specs/001-frontend-proxy-compose/quickstart.md
- [X] T023 Validar consistencia final de contrato, runbook y compose en specs/001-frontend-proxy-compose/contracts/proxy-exposure-contract.md
- [X] T024 Verificar configuracion final de red/puertos sin regresiones en docker/compose.yml
- [ ] T025 [P] Ejecutar build de frontend Angular y registrar evidencia en docs/frontend-dockerfile-runbook.md
- [ ] T026 Validar compatibilidad de integracion con API versionada `/api/v1` tras build en specs/001-frontend-proxy-compose/quickstart.md
- [ ] T027 Medir tiempo end-to-end de arranque (`compose up` hasta respuesta exitosa en `/`) y registrar evidencia de cumplimiento de SC-004 en specs/001-frontend-proxy-compose/quickstart.md

---

## Dependencies & Execution Order

## Constitutional Compliance Check

- [X] Verificar cumplimiento explicito de constitucion en `spec.md`, `plan.md` y `tasks.md` antes de implementacion.
- [ ] Verificar cumplimiento explicito de constitucion antes de merge del feature.

### Phase Dependencies

- Phase 1 (Setup): inicia inmediatamente.
- Phase 2 (Foundational): depende de Phase 1 y bloquea todas las historias.
- Phase 3 (US1): depende de Phase 2.
- Phase 4 (US2): depende de Phase 3.
- Phase 5 (US3): depende de Phase 3.
- Phase 6 (Polish): depende de completar las historias objetivo (US1, US2, US3).

### User Story Dependencies

- US1 (P1): sin dependencia de otras historias; define el MVP.
- US2 (P2): depende de US1 para validar flujo funcional sobre la topologia final de exposicion.
- US3 (P3): depende de US1; puede ejecutarse en paralelo con US2 tras completar base comun.

### Within Each User Story

- Primero ajustar configuracion base de la historia.
- Luego actualizar validacion operativa/documentacion.
- Cerrar con comprobacion independiente de la historia.

---

## Parallel Opportunities

- En Setup: T002 y T003 en paralelo tras T001.
- En Foundational: T006 y T007 en paralelo tras T004-T005.
- En US1: T011 y T012 en paralelo tras T009-T010.
- En US2: T015 puede ejecutarse en paralelo con T013/T014.
- En US3: T019 puede ejecutarse en paralelo con T018.
- En Polish: T022 puede ejecutarse en paralelo con T024.
- En Polish: T025 puede ejecutarse en paralelo con T024.
- En Polish: T026 y T027 se ejecutan despues de T025.

---

## Parallel Example: User Story 1

```bash
# Ejecutar en paralelo despues de definir la politica base de exposicion:
Task T011: Actualizar verificacion de puertos en specs/001-frontend-proxy-compose/quickstart.md
Task T012: Actualizar runbook de endpoint unico en docs/frontend-dockerfile-runbook.md
```

## Parallel Example: User Story 2

```bash
# Ejecutar en paralelo durante estabilizacion funcional:
Task T015: Asegurar API_BASE_URL por proxy en docker/compose.yml
Task T016: Actualizar validaciones funcionales en docs/frontend-dockerfile-runbook.md
```

## Parallel Example: User Story 3

```bash
# Ejecutar en paralelo para experiencia de equipo:
Task T019: Documentar conflicto de puerto 80 en specs/001-frontend-proxy-compose/quickstart.md
Task T020: Documentar checklist operativo en docs/frontend-dockerfile-runbook.md
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Phase 1.
2. Completar Phase 2 (bloqueante).
3. Completar Phase 3 (US1).
4. Validar acceso `http://localhost:80` y no exposicion de servicios internos.

### Incremental Delivery

1. Entregar MVP con US1.
2. Extender con US2 para asegurar continuidad funcional frontend/API.
3. Extender con US3 para simplificar operacion de equipo.
4. Cerrar con Phase 6 de verificacion cruzada.

### Parallel Team Strategy

1. Un desarrollador estabiliza Foundational (T004-T008).
2. Tras US1, otro desarrollador avanza US2 mientras un tercero avanza US3.
3. Integrar resultados en Polish con validacion final unica.
