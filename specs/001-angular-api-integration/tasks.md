# Tasks: Front Angular Consume API REST

**Input**: Design documents from `/specs/001-angular-api-integration/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se agregan tareas de pruebas automatizadas porque la especificacion no exige enfoque TDD ni suite automatizada nueva para esta feature. Se incluyen criterios de prueba independiente y validacion E2E manual por historia.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar el modulo Angular y la estructura base del frontend.

- [X] T001 Scaffold Angular 21 workspace en frontend/ generando frontend/angular.json y frontend/package.json
- [X] T002 Configurar scripts de desarrollo/build/lint en frontend/package.json
- [X] T003 [P] Configurar app shell y bootstrap inicial en frontend/src/main.ts y frontend/src/app/app.config.ts
- [X] T004 [P] Definir routing base de la aplicacion en frontend/src/app/app.routes.ts
- [X] T005 [P] Crear configuracion de API por entorno con fallback local en frontend/src/environments/environment.ts y frontend/src/environments/environment.prod.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura transversal que bloquea la implementacion de todas las historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Crear token/configuracion de API base URL en frontend/src/app/core/config/api.config.ts
- [X] T007 [P] Implementar estado de sesion en memoria para Basic Auth en frontend/src/app/auth/session-auth.service.ts
- [X] T008 [P] Implementar interceptor de Basic Auth para solicitudes protegidas en frontend/src/app/core/http/basic-auth.interceptor.ts
- [X] T009 [P] Implementar normalizacion de errores API en frontend/src/app/core/http/api-error.mapper.ts
- [X] T010 Implementar politica de retry solo para GET en frontend/src/app/core/http/retry-get.interceptor.ts
- [X] T011 Registrar HttpClient e interceptores globales en frontend/src/app/app.config.ts
- [X] T012 [P] Definir modelos compartidos de dominio en frontend/src/app/shared/models/empleado.model.ts y frontend/src/app/shared/models/departamento.model.ts
- [X] T013 [P] Definir modelo de error y estado de request en frontend/src/app/shared/models/api-error.model.ts y frontend/src/app/shared/models/request-state.model.ts
- [X] T014 Implementar cliente HTTP base con soporte de paginacion en frontend/src/app/core/http/api-client.service.ts
- [X] T015 Implementar guard de rutas protegidas para administrador autenticado en frontend/src/app/auth/auth.guard.ts
- [X] T044 Ejecutar verificacion explicita de cumplimiento constitucional pre-implementacion (spec/plan/tasks) y registrar resultado en specs/001-angular-api-integration/quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Autenticar y Listar Datos (Priority: P1) 🎯 MVP

**Goal**: Permitir login con Basic Auth en sesion activa y consulta de listados paginados de empleados/departamentos.

**Independent Test**: Iniciar sesion con credenciales validas y visualizar ambos listados paginados; con credenciales invalidas se bloquea el acceso a rutas protegidas.

### Implementation for User Story 1

- [X] T016 [P] [US1] Implementar pagina de login con formulario de credenciales en frontend/src/app/auth/login-page.component.ts
- [X] T017 [US1] Implementar facade de autenticacion (login/logout/session restore en memoria) en frontend/src/app/auth/auth.facade.ts
- [X] T018 [US1] Proteger y enrutar vistas principales con returnUrl en frontend/src/app/app.routes.ts
- [X] T019 [P] [US1] Implementar servicio de lectura paginada de empleados en frontend/src/app/empleados/empleados-api.service.ts
- [X] T020 [P] [US1] Implementar servicio de lectura paginada de departamentos en frontend/src/app/departamentos/departamentos-api.service.ts
- [X] T021 [US1] Construir vista de listado de empleados con estados loading/empty/error en frontend/src/app/empleados/empleados-list-page.component.ts
- [X] T022 [US1] Construir vista de listado de departamentos con estados loading/empty/error en frontend/src/app/departamentos/departamentos-list-page.component.ts
- [X] T023 [US1] Implementar manejo global de 401/403 con redireccion y mensaje accionable en frontend/src/app/core/http/auth-error.handler.ts

**Checkpoint**: User Story 1 completa y demostrable como MVP.

---

## Phase 4: User Story 2 - Gestionar Empleados desde UI (Priority: P2)

**Goal**: Habilitar CRUD completo de empleados desde el frontend con manejo claro de errores de validacion/negocio.

**Independent Test**: Crear, editar y eliminar un empleado desde UI, confirmar persistencia en backend y refresco correcto del listado.

### Implementation for User Story 2

- [X] T025 [P] [US2] Definir modelo de formulario y validaciones de empleado en frontend/src/app/empleados/empleado-form.model.ts
- [X] T026 [US2] Construir componente de formulario de empleado con bloqueo de doble envio en frontend/src/app/empleados/empleado-form.component.ts
- [X] T027 [US2] Extender operaciones create/update/delete de empleados en frontend/src/app/empleados/empleados-api.service.ts
- [X] T028 [US2] Implementar pagina de alta/edicion de empleado y rutas asociadas en frontend/src/app/empleados/empleado-edit-page.component.ts
- [X] T029 [US2] Implementar accion de eliminacion con confirmacion y refresco de lista en frontend/src/app/empleados/empleados-list-page.component.ts
- [X] T030 [US2] Mapear errores de validacion/conflicto a mensajes de formulario en frontend/src/app/empleados/empleado-error.presenter.ts

**Checkpoint**: User Story 2 funcional de forma independiente sobre la base de autenticacion.

---

## Phase 5: User Story 3 - Gestionar Departamentos y Relacion (Priority: P3)

**Goal**: Habilitar CRUD de departamentos y reglas de integridad con empleados asociados.

**Independent Test**: Crear y editar departamento, eliminar uno sin empleados asociados, y verificar bloqueo de eliminacion cuando existan empleados asociados.

### Implementation for User Story 3

- [X] T032 [P] [US3] Definir modelo de formulario y validaciones de departamento en frontend/src/app/departamentos/departamento-form.model.ts
- [X] T033 [US3] Construir componente de formulario de departamento en frontend/src/app/departamentos/departamento-form.component.ts
- [X] T034 [US3] Extender operaciones create/update/delete/get de departamentos en frontend/src/app/departamentos/departamentos-api.service.ts
- [X] T035 [US3] Implementar pagina de alta/edicion de departamento y rutas asociadas en frontend/src/app/departamentos/departamento-edit-page.component.ts
- [X] T036 [US3] Implementar eliminacion de departamento con manejo de bloqueo de integridad en frontend/src/app/departamentos/departamentos-list-page.component.ts
- [X] T037 [US3] Mostrar relacion de empleados por departamento (empleadosCount y pistas de asociacion) en frontend/src/app/departamentos/departamentos-list-page.component.ts
- [X] T046 [US3] Implementar bloqueo de doble envio para create/update/delete de departamentos en frontend/src/app/departamentos/departamento-form.component.ts y frontend/src/app/departamentos/departamentos-list-page.component.ts

**Checkpoint**: User Story 3 completa con reglas de integridad de relacion.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras transversales y validacion final de calidad.

- [X] T039 [P] Crear componentes reutilizables de loading/error/empty en frontend/src/app/shared/ui/request-feedback.component.ts
- [X] T040 [P] Ajustar estilos responsive y consistencia visual base en frontend/src/styles.scss
- [X] T041 Validar cumplimiento de consumo exclusivo `/api/v1/...` y sincronizar contrato en specs/001-angular-api-integration/contracts/angular-api-integration.openapi.yaml
- [X] T042 Ejecutar build/lint y documentar resultados en specs/001-angular-api-integration/quickstart.md
- [X] T043 Ejecutar quickstart E2E completo y registrar evidencia de criterios SC-001..SC-004 en specs/001-angular-api-integration/quickstart.md
- [X] T045 Ejecutar verificacion explicita de cumplimiento constitucional pre-merge (spec/plan/tasks + build frontend) y registrar resultado en specs/001-angular-api-integration/quickstart.md
- [X] T047 Consolidar evidencia manual por historia (US1, US2, US3) y protocolo de medicion SC-001..SC-004 en specs/001-angular-api-integration/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sin dependencias.
- **Phase 2 (Foundational)**: depende de Phase 1; bloquea todas las historias.
- **Phase 3 (US1)**: depende de Phase 2; define el MVP.
- **Phase 4 (US2)**: depende de Phase 2 y reutiliza autenticacion/listados de US1.
- **Phase 5 (US3)**: depende de Phase 2 y reutiliza autenticacion/listados de US1.
- **Phase 6 (Polish)**: depende de historias objetivo completadas.

### User Story Completion Order

- **US1 (P1)** -> **US2 (P2)** -> **US3 (P3)**

### Dependency Graph

- **US1**: inicio tras Foundation, sin depender de US2/US3.
- **US2**: inicio tras Foundation; integra navegacion y auth de US1.
- **US3**: inicio tras Foundation; integra navegacion y auth de US1.

---

## Parallel Execution Examples

### User Story 1

- Ejecutar en paralelo `T019` y `T020` (servicios de lectura de dominios distintos).
- Ejecutar en paralelo `T021` y `T022` una vez completados servicios de lectura.

### User Story 2

- Ejecutar en paralelo `T025` y preparacion de rutas de `T028` (archivos distintos).
- Ejecutar en paralelo ajustes de `T029` y `T030` despues de `T027`.

### User Story 3

- Ejecutar en paralelo `T032` y estructura inicial de `T035` (archivos distintos).
- Ejecutar en paralelo `T036` y `T037` despues de `T034`.

---

## Implementation Strategy

### MVP First (US1)

1. Completar Phase 1 + Phase 2.
2. Completar US1 (T016-T023).
3. Validar flujo completo de autenticacion y listados.
4. Demostrar MVP antes de pasar a CRUD.

### Incremental Delivery

1. Entregar MVP con US1.
2. Agregar US2 para CRUD de empleados.
3. Agregar US3 para CRUD de departamentos y reglas de relacion.
4. Cerrar con Polish y evidencia de criterios de exito.

### Parallel Team Strategy

1. Equipo completo en Foundation (T006-T015).
2. Luego, reparto por dominio:
   - Dev A: US1 navegacion/auth/listados.
   - Dev B: US2 empleados CRUD.
   - Dev C: US3 departamentos CRUD.
3. Integracion final en Phase 6.

---

## Notes

- Las tareas con `[P]` son paralelizables por trabajar en archivos independientes.
- Las tareas de historias incluyen etiqueta `[USx]` para trazabilidad directa con spec.md.
- Cada historia define criterio de prueba independiente para validacion incremental.
- Los pasos de validacion final se consolidan en quickstart.md para ejecucion reproducible.