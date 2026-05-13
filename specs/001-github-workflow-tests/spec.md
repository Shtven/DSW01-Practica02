# Feature Specification: GitHub Workflow Front and Back Unit Tests

**Feature Branch**: `001-github-workflow-tests`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "genera un github workflow que se ejecute cuando se haga push o pull request en las ramas master y develop con 2 jobs para ejecutar y hacer pruebas unitarias en front y back por separado"

## Clarifications

### Session 2026-04-17

- Q: Que estrategia de versiones debe usar CI para ejecutar pruebas unitarias de frontend y backend? -> A: Opcion B, matriz minima con Node LTS (frontend) y Java 17 (backend).
- Q: Como deben declararse los comandos de pruebas en el workflow? -> A: Opcion A, comandos directos definidos en el propio workflow.
- Q: Como debe comportarse la ejecucion cuando falla un job de pruebas? -> A: Opcion B, detener la ejecucion restante (fail-fast habilitado).
- Q: Que nivel de permisos debe usar el token de GitHub Actions en este workflow? -> A: Opcion A, permisos minimos globales (`contents: read`).

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Validacion Automatica En Push y PR (Priority: P1)

Como integrante del equipo, quiero que el pipeline se ejecute automaticamente en push y pull request hacia master y develop para detectar regresiones lo antes posible.

**Why this priority**: Es la base de calidad continua y evita que cambios sin validar lleguen a ramas principales.

**Independent Test**: Crear un commit de prueba y abrir un pull request hacia master o develop; confirmar que el workflow inicia automaticamente en ambos casos.

**Acceptance Scenarios**:

1. **Given** un push a master o develop, **When** GitHub procesa el evento, **Then** el workflow de pruebas se dispara automaticamente.
2. **Given** un pull request abierto hacia master o develop, **When** el evento de PR es recibido, **Then** el workflow de pruebas se dispara automaticamente.

---

### User Story 2 - Pruebas Unitarias Separadas Por Capa (Priority: P2)

Como desarrollador, quiero dos jobs separados para front y back para identificar rapidamente donde falla una prueba y reducir tiempo de diagnostico.

**Why this priority**: La separacion por jobs mejora trazabilidad y evita mezclar fallas de frontend y backend.

**Independent Test**: Ejecutar el workflow en una rama con pruebas validas y confirmar que aparecen dos jobs independientes, uno para frontend y otro para backend.

**Acceptance Scenarios**:

1. **Given** el workflow en ejecucion, **When** se visualizan los resultados, **Then** deben existir dos jobs diferenciados con resultado independiente.

---

### User Story 3 - Retroalimentacion Clara Para Revision de Cambios (Priority: P3)

Como revisor de codigo, quiero ver el estado de cada job de pruebas en el PR para decidir si un cambio esta listo para integrarse.

**Why this priority**: Facilita decision de merge con evidencia concreta de calidad por capa.

**Independent Test**: Abrir un PR con una falla intencional en front o back y verificar que solo el job correspondiente falle y quede claramente reportado.

**Acceptance Scenarios**:

1. **Given** una falla de pruebas en una sola capa, **When** finaliza el workflow, **Then** el job afectado aparece en estado fallido y los jobs no iniciados pueden quedar cancelados por fail-fast.

---

### Edge Cases

- Push o PR hacia ramas distintas de master y develop no debe disparar el workflow.
- Si faltan dependencias de frontend o backend, el job correspondiente debe fallar de forma explicita sin ocultar el error.
- Si un job falla con fail-fast activo, los jobs no iniciados pueden quedar cancelados y el resultado global debe reflejar fallo.
- Cambios que solo afectan una capa igualmente deben ejecutar ambos jobs segun la politica definida por esta feature.
- Reintentos manuales del workflow deben respetar la misma estructura de dos jobs separados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend service MUST run on Spring Boot 3.x with Java 17.
- **FR-001A**: If the feature includes web frontend scope, UI MUST run on Angular 21.x.
- **FR-002**: Sin cambios en autenticación HTTP Basic.
- **FR-003**: Sin cambios en credenciales base/equivalentes.
- **FR-004**: Sin cambios en persistencia PostgreSQL.
- **FR-005**: Sin cambios en contrato Swagger/OpenAPI.
- **FR-006**: Sin cambios en versionado de endpoints.
- **FR-007**: Sin cambios en ejecutabilidad Docker.
- **FR-008**: Sin cambios en política de deprecación API.
- **FR-009**: System MUST define a GitHub Actions workflow that triggers on push events targeting `master` and `develop`.
- **FR-010**: System MUST define a GitHub Actions workflow that triggers on pull request events targeting `master` and `develop`.
- **FR-011**: System MUST include exactly two unit-test jobs in the workflow: one dedicated to frontend tests and one dedicated to backend tests.
- **FR-012**: System MUST execute frontend and backend unit-test jobs as separate reportable jobs in the workflow run.
- **FR-013**: System MUST present independent success or failure status per job so reviewers can identify the failing layer.
- **FR-014**: System MUST fail the workflow run when either frontend or backend unit-test job fails.
- **FR-015**: System MUST be stored in repository CI configuration so it runs automatically without manual invocation.
- **FR-016**: System MUST execute frontend unit tests on a Node LTS runtime and backend unit tests on Java 17 runtime, explicitly declared in CI configuration.
- **FR-017**: System MUST declare direct unit-test commands for frontend and backend inside the workflow definition.
- **FR-018**: El sistema MUST detener la programación de ejecución descendente de pruebas cuando se detecte el primer fallo, según la estrategia de dependencias del workflow, y el resultado global del workflow MUST quedar en failed.
- **FR-019**: System MUST set GitHub Actions token permissions to minimum global read-only scope (`contents: read`) for this test workflow.

### Assumptions

- El repositorio ya dispone de comandos de pruebas unitarias funcionales para frontend y backend.
- El proceso de revision de codigo utiliza el estado de GitHub Actions como criterio de calidad para merge.
- El alcance se limita a pruebas unitarias de front y back; no incluye pruebas de integracion o despliegue.

### Dependencies

- Disponibilidad de runner de GitHub Actions compatible con las herramientas de build del proyecto.
- Archivos y configuraciones de proyecto de frontend y backend deben estar presentes en el repositorio.
- Acceso de GitHub Actions al codigo del repositorio en eventos push y pull request.

### Key Entities *(include if feature involves data)*

- **Workflow Trigger Rule**: Define eventos y ramas que activan el workflow (`push` y `pull_request` sobre `master` y `develop`).
- **Unit Test Job**: Representa cada job de pruebas (frontend o backend) con estado independiente de ejecucion.
- **Workflow Run Result**: Resultado consolidado del workflow derivado de los estados individuales de ambos jobs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los push hacia master y develop disparan automaticamente el workflow de CI.
- **SC-002**: El 100% de los pull request hacia master y develop disparan automaticamente el workflow de CI.
- **SC-003**: El 100% de las ejecuciones del workflow muestran dos jobs separados y claramente identificables (frontend y backend).
- **SC-004**: En el 100% de ejecuciones con fallo intencional de una capa, el workflow finaliza en estado failed y no se ejecutan validaciones posteriores definidas como dependientes.

### Antes de implementación
- Runtime: PASS. Esta feature no cambia el baseline de Java 17 ni Spring Boot 3.x.
- Frontend: PASS. Esta feature no cambia el baseline de Angular 21.x.
- Seguridad: PASS. No modifica autenticación HTTP Basic ni credenciales base/equivalentes.
- Datos: PASS. No hay cambios de persistencia ni migraciones PostgreSQL.
- API/Contratos: PASS. No hay cambios de endpoints, versionado ni contrato OpenAPI.
- Entrega: PASS. Se agrega automatización CI sin alterar la arquitectura funcional.

### Antes de merge

- MUST incluir evidencia de ejecución en PR con:
  - Resultado del job frontend-unit-tests.
  - Resultado del job backend-unit-tests.
  - Estado final del workflow (success/failure según corresponda).
- La evidencia MUST registrarse en specs/001-github-workflow-tests/quickstart.md.