# Tasks: Autenticacion por Empleado

**Input**: Design documents from `/specs/001-empleados-auth-password/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se generan tareas de pruebas automaticas porque no fueron solicitadas explicitamente en la especificacion. Se incluye validacion manual E2E en fase final.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All tasks include exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de autenticacion por empleado sin romper la arquitectura actual

- [ ] T001 Verificar dependencias de seguridad/validacion vigentes para autenticacion por entidad en pom.xml
- [ ] T002 [P] Revisar configuracion base de seguridad y propiedades actuales de Basic Auth en src/main/resources/application.properties y src/main/java/com/example/empleados/config/SecurityConfig.java
- [ ] T003 [P] Alinear artefactos de especificacion de la feature para ejecucion tecnica en specs/001-empleados-auth-password/plan.md y specs/001-empleados-auth-password/research.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cambios de persistencia y modelo base que bloquean todas las historias

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Crear migracion Flyway para agregar `contrasena` e indice/constraint de unicidad case-insensitive de `nombre` en src/main/resources/db/migration/V3__add_empleado_password_and_login_normalization.sql
- [ ] T005 [P] Actualizar entidad `Empleado` con campo `contrasena` y restricciones de persistencia en src/main/java/com/example/empleados/domain/Empleado.java
- [ ] T006 [P] Incorporar consulta de repositorio por nombre normalizado para autenticacion en src/main/java/com/example/empleados/repository/EmpleadoRepository.java
- [ ] T007 [P] Ajustar DTOs de entrada/salida para soportar `contrasena` sin exponer hash en respuesta en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java, src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java y src/main/java/com/example/empleados/api/dto/EmpleadoResponse.java
- [ ] T008 Incorporar validacion global para errores de politica de contrasena/login y mensajes consistentes en src/main/java/com/example/empleados/api/GlobalExceptionHandler.java

**Checkpoint**: Persistencia y contratos DTO listos para implementar historias

---

## Phase 3: User Story 1 - Iniciar Sesion con Empleado (Priority: P1) MVP

**Goal**: Habilitar autenticacion Basic Auth usando `nombre` (normalizado) y `contrasena` del empleado

**Independent Test**: Crear empleado con contrasena valida y ejecutar endpoint protegido con `nombre:contrasena` (`200`); repetir con contrasena incorrecta o usuario inexistente (`401`).

### Implementation for User Story 1

- [ ] T009 [US1] Implementar `UserDetailsService` basado en `Empleado` por nombre normalizado en src/main/java/com/example/empleados/service/EmpleadoUserDetailsService.java
- [ ] T010 [US1] Configurar `PasswordEncoder` BCrypt y `AuthenticationProvider` para Basic Auth en src/main/java/com/example/empleados/config/SecurityConfig.java
- [ ] T011 [US1] Retirar dependencia de credenciales fijas en configuracion de seguridad en src/main/java/com/example/empleados/config/SecurityConfig.java y src/main/resources/application.properties
- [ ] T012 [US1] Ajustar manejo de no autorizado para credenciales invalidas sin fuga de informacion en src/main/java/com/example/empleados/config/SecurityConfig.java
- [ ] T013 [US1] Documentar esquema de autenticacion basado en empleado en src/main/java/com/example/empleados/config/OpenApiConfig.java

**Checkpoint**: US1 habilita acceso autenticado por empleado y bloquea accesos invalidos

---

## Phase 4: User Story 2 - Gestionar Contrasena en Empleados (Priority: P2)

**Goal**: Permitir alta/actualizacion de empleados con contrasena valida, almacenada con BCrypt y login case-insensitive unico

**Independent Test**: Alta de empleado con contrasena valida (`201`), autenticacion exitosa; cambio de contrasena (`200`) invalida la anterior y valida la nueva.

### Implementation for User Story 2

- [ ] T014 [US2] Aplicar politica minima de contrasena (8+, letra y numero) en DTOs de empleado en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java y src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java
- [ ] T015 [US2] Normalizar `nombre` a minusculas y validar unicidad case-insensitive en create/update de empleados en src/main/java/com/example/empleados/service/EmpleadoService.java
- [ ] T016 [US2] Hashear contrasena con BCrypt antes de persistir en create/update de empleados en src/main/java/com/example/empleados/service/EmpleadoService.java
- [ ] T017 [US2] Garantizar que `EmpleadoResponse` no exponga contrasena ni hash en src/main/java/com/example/empleados/service/EmpleadoService.java y src/main/java/com/example/empleados/api/dto/EmpleadoResponse.java
- [ ] T018 [US2] Ajustar endpoint de actualizacion para incluir cambio de contrasena dentro de reglas autorizadas en src/main/java/com/example/empleados/api/EmpleadoController.java
- [ ] T019 [US2] Documentar reglas de payload/validacion de contrasena y login en src/main/java/com/example/empleados/api/EmpleadoController.java

**Checkpoint**: US2 garantiza gestion segura de contrasena y coherencia de login

---

## Phase 5: User Story 3 - Mantener Compatibilidad Operativa (Priority: P3)

**Goal**: Preservar funcionamiento CRUD de empleados/departamentos bajo nuevo esquema de autenticacion

**Independent Test**: Ejecutar flujo CRUD de departamentos y empleados autenticando con empleado valido, validando codigos esperados y sin regresiones funcionales.

### Implementation for User Story 3

- [ ] T020 [US3] Adaptar quickstart operacional para bootstrap inicial y consumo con credenciales de empleado en specs/001-empleados-auth-password/quickstart.md
- [ ] T021 [US3] Revisar y ajustar puntos de seguridad en endpoints de departamentos para compatibilidad del nuevo login en src/main/java/com/example/empleados/api/DepartamentoController.java y src/main/java/com/example/empleados/config/SecurityConfig.java
- [ ] T022 [US3] Asegurar que contratos de error/autenticacion permanezcan consistentes para endpoints protegidos en src/main/java/com/example/empleados/api/GlobalExceptionHandler.java

**Checkpoint**: US3 valida continuidad operativa con autenticacion por empleado

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre transversal con consistencia documental y verificacion final

- [ ] T023 [P] Alinear contrato OpenAPI final con implementacion de contrasena y autenticacion por empleado en specs/001-empleados-auth-password/contracts/empleados-auth-password.openapi.yaml
- [ ] T024 [P] Actualizar guia de uso final con ejemplos de login valido/invalido y cambios de contrasena en specs/001-empleados-auth-password/quickstart.md
- [ ] T025 Ejecutar validacion manual E2E completa (alta empleado autenticable, login OK/FAIL, cambio de contrasena, CRUD protegido) y registrar resultados en specs/001-empleados-auth-password/quickstart.md
- [ ] T026 Validar compilacion final sin pruebas (`mvn -q -DskipTests compile`) y registrar evidencia en specs/001-empleados-auth-password/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea historias
- **US1 (Phase 3)**: depende de Foundational
- **US2 (Phase 4)**: depende de Foundational y del flujo de autenticacion base de US1
- **US3 (Phase 5)**: depende de US1 + US2 para validar regresion operativa
- **Polish (Phase 6)**: depende de historias objetivo completas

### User Story Dependencies (Completion Graph)

- **US1 (P1)**: base de autenticacion por empleado
- **US2 (P2)**: requiere autenticacion base activa para validar cambios de contrasena
- **US3 (P3)**: valida continuidad operativa sobre US1 y US2

Representacion:

`Setup -> Foundational -> US1 -> US2 -> US3 -> Polish`

### Within Each User Story

- Servicio y seguridad antes de controladores
- Controladores antes de documentacion de contrato
- Cierre de historia con criterio de prueba independiente

### Parallel Opportunities

- **Setup**: T002 y T003 en paralelo
- **Foundational**: T005, T006 y T007 en paralelo tras T004
- **Polish**: T023 y T024 en paralelo

---

## Parallel Example: User Story 1

```bash
Task: "T009 [US1] UserDetailsService por empleado en src/main/java/com/example/empleados/service/EmpleadoUserDetailsService.java"
Task: "T010 [US1] AuthenticationProvider BCrypt en src/main/java/com/example/empleados/config/SecurityConfig.java"
```

## Parallel Example: User Story 2

```bash
Task: "T014 [US2] Politica de contrasena en src/main/java/com/example/empleados/api/dto/CreateEmpleadoRequest.java y src/main/java/com/example/empleados/api/dto/UpdateEmpleadoRequest.java"
Task: "T017 [US2] No exponer contrasena en src/main/java/com/example/empleados/service/EmpleadoService.java y src/main/java/com/example/empleados/api/dto/EmpleadoResponse.java"
```

## Parallel Example: User Story 3

```bash
Task: "T020 [US3] Quickstart de compatibilidad en specs/001-empleados-auth-password/quickstart.md"
Task: "T022 [US3] Contratos de error de autenticacion en src/main/java/com/example/empleados/api/GlobalExceptionHandler.java"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar Phase 3 (US1)
4. Validar autenticacion por empleado de forma independiente
5. Demostrar MVP

### Incremental Delivery

1. Setup + Foundational
2. Entregar US1 (autenticacion por empleado)
3. Entregar US2 (gestion segura de contrasena)
4. Entregar US3 (compatibilidad operativa)
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
- Cada historia define criterio de prueba independiente y verificable
