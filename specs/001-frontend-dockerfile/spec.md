# Feature Specification: Frontend Dockerfile Startup

**Feature Branch**: `001-frontend-dockerfile`  
**Created**: 2026-04-07  
**Status**: Ready for Planning  
**Input**: User description: "crea un archivo dockerfile que funcione para iniciar el frontend"

## Clarifications

### Session 2026-04-07

- Q: Que modo de runtime debe usar el Dockerfile del frontend? -> A: Opcion A, ejecutar `ng serve` dentro del contenedor.
- Q: Como debe definirse el puerto del frontend en contenedor? -> A: Opcion B, puerto configurable por variable de entorno con default 4200.
- Q: Como debe configurarse la URL base de API para el frontend en contenedor? -> A: Opcion B, variable `API_BASE_URL` obligatoria en runtime con fallo de arranque si falta.
- Q: Que politica de reinicio debe aplicar al contenedor frontend ante fallo? -> A: Opcion B, reinicio automatico `on-failure` con limite de intentos.
- Q: Cual es el alcance final de esta feature respecto a Docker Compose? -> A: Opcion A, solo Dockerfile frontend y guia de build/run, sin cambios obligatorios en compose.

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

### User Story 1 - Iniciar Frontend En Contenedor (Priority: P1)

Como desarrollador, quiero un Dockerfile funcional para el frontend para poder levantar la interfaz en contenedor sin depender de ejecucion local manual.

**Why this priority**: Es el valor central de la solicitud y habilita ejecucion reproducible del frontend en cualquier equipo.

**Independent Test**: Construir imagen del frontend y ejecutar contenedor; validar que la UI responde en el puerto publicado sin pasos extra.

**Acceptance Scenarios**:

1. **Given** el codigo frontend disponible, **When** se construye la imagen con el Dockerfile definido, **Then** la construccion finaliza sin errores.
2. **Given** la imagen construida, **When** se inicia el contenedor frontend, **Then** la UI queda accesible desde el puerto documentado.

---

### User Story 2 - Integracion Con API En Contenedor (Priority: P2)

Como desarrollador funcional, quiero que el frontend iniciado desde Docker pueda comunicarse con la API del proyecto para validar flujos reales.

**Why this priority**: Un frontend que inicia pero no se integra con API no cubre el uso funcional esperado.

**Independent Test**: Iniciar frontend en contenedor con URL de API configurada y completar login + lectura de datos en UI.

**Acceptance Scenarios**:

1. **Given** frontend levantado en contenedor y API disponible, **When** el usuario inicia sesion y consulta datos, **Then** la UI muestra informacion sin reconfiguracion manual durante la ejecucion.

---

### User Story 3 - Operacion Documentada Del Contenedor (Priority: P3)

Como integrante del equipo, quiero una guia clara de build y run del contenedor frontend para reducir errores de onboarding.

**Why this priority**: La documentacion operativa sostiene el cambio y evita dependencia de conocimiento tribal.

**Independent Test**: Seguir la guia desde cero en otra maquina y verificar que el contenedor frontend inicia correctamente.

**Acceptance Scenarios**:

1. **Given** una persona nueva en el repositorio, **When** sigue la guia de uso del Dockerfile frontend, **Then** logra construir y ejecutar el contenedor sin asistencia directa.

---

### Edge Cases

- Que ocurre si el puerto publicado del frontend ya esta en uso por otra aplicacion?
- Como se comporta el contenedor cuando la URL de API no esta definida o es invalida?
- Que respuesta recibe el usuario si la UI inicia pero el backend no esta disponible temporalmente?
- Que pasa si la imagen se construye en una arquitectura distinta a la de ejecucion esperada?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend service MUST run on Spring Boot 3.x with Java 17.
- **FR-001A**: If the feature includes web frontend scope, UI MUST run on Angular 21.x.
- **FR-002**: System MUST protect business endpoints using HTTP Basic Authentication.
- **FR-003**: System MUST authenticate baseline local credentials `admin` / `admin123`, or an equivalent documented admin identifier when login is email-based (keeping `admin123` as base local secret).
- **FR-004**: System MUST persist transactional data in PostgreSQL.
- **FR-005**: System MUST provide and maintain Swagger/OpenAPI documentation for exposed endpoints.
- **FR-006**: System MUST version public API endpoints explicitly (e.g., `/api/v1/...`) or document an equivalent strategy.
- **FR-007**: System MUST be executable in Docker, including local dependency orchestration.
- **FR-008**: System MUST define deprecation policy and migration path for breaking API changes.
- **FR-009**: System MUST provide a dedicated Dockerfile for frontend image build and container startup using `ng serve` as the runtime mode.
- **FR-010**: System MUST publish frontend UI through a documented host port configurable by environment variable with default value 4200.
- **FR-011**: System MUST require API base URL configuration at runtime through `API_BASE_URL` without requiring source code changes, and container startup MUST fail with clear error if the variable is missing.
- **FR-012**: System MUST include reproducible build and run instructions for the frontend container in project documentation.
- **FR-013**: System MUST preserve current frontend functional behavior (login and data retrieval flows) when running via container.
- **FR-014**: System MUST provide clear operational behavior for temporary API unavailability while frontend container is running.
- **FR-015**: System MUST apply bounded automatic restart behavior on container failure (`on-failure` with maximum 3 retries), avoiding infinite restart loops.
- **FR-016**: System MUST keep feature scope limited to frontend Dockerfile and its operational documentation; changes to `docker/compose.yml` are optional and not required for acceptance.

### Key Entities *(include if feature involves data)*

- **Frontend Dockerfile Definition**: Especificacion de build y runtime del frontend, con etapas y puertos de exposicion.
- **Frontend Runtime Configuration**: Parametros de ejecucion del contenedor, incluyendo URL base de API y puerto publico.
- **Frontend Container Instance**: Instancia ejecutable que sirve la UI y se integra con la API del proyecto.

### Assumptions

- El alcance se limita al frontend y su contenedorizacion; no requiere cambios de endpoints de negocio.
- El backend y base de datos ya tienen mecanismo de ejecucion local existente.
- El equipo usara Docker/Compose para validacion local de la feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de 10 builds consecutivos del frontend con Dockerfile finaliza correctamente en entorno local estandar.
- **SC-002**: Al menos el 95% de 20 inicios de contenedor frontend deja la UI accesible en el puerto documentado en menos de 60 segundos.
- **SC-003**: En al menos el 95% de ejecuciones del contenedor frontend, un usuario puede completar login y una lectura de datos sin reconfiguracion manual del contenedor.
- **SC-004**: El 100% de una prueba de onboarding con al menos 2 integrantes del equipo logra build y run del frontend en contenedor siguiendo solo la documentacion publicada.
