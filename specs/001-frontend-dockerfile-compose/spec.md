# Feature Specification: Frontend Docker Compose Integration

**Feature Branch**: `001-frontend-dockerfile-compose`  
**Created**: 2026-03-27  
**Status**: Ready for Planning  
**Input**: User description: "incluye un dockerfile a el frontend para ejecutar todo en el docker compose"

## Clarifications

### Session 2026-03-27

- Q: Cual debe ser el modo de ejecucion del contenedor frontend en Docker Compose? -> A: Opcion B, build estatico de Angular servido con Nginx.
- Q: Como debe configurarse la URL base del API para el frontend en contenedor? -> A: Opcion B, inyeccion en runtime al iniciar el contenedor para mantener imagen reutilizable entre entornos.
- Q: Como debe coordinarse el arranque del frontend respecto al backend? -> A: Opcion A, frontend condicionado a healthcheck exitoso del backend.
- Q: Como debe reaccionar la UI si el backend no esta disponible temporalmente? -> A: Opcion B, mensaje claro de indisponibilidad con reintento automatico y backoff corto.
- Q: Que politica de exposicion de puertos debe usar el compose del stack? -> A: Opcion A, exponer solo frontend al host y mantener backend/DB en red interna.

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

### User Story 1 - Levantar Todo El Entorno (Priority: P1)

Como desarrollador del proyecto, quiero levantar frontend, backend y base de datos con un solo comando para poder validar flujos completos sin configuraciones manuales por servicio.

**Why this priority**: El valor principal de la solicitud es eliminar friccion de arranque y habilitar un entorno full-stack reproducible.

**Independent Test**: Ejecutar el orquestador local una sola vez en un entorno limpio y comprobar que los tres servicios quedan accesibles para uso funcional.

**Acceptance Scenarios**:

1. **Given** un entorno sin procesos activos del proyecto, **When** el usuario inicia la orquestacion local, **Then** el frontend, backend y base de datos quedan operativos sin pasos adicionales.
2. **Given** que el entorno ya estuvo detenido, **When** el usuario reinicia la orquestacion, **Then** el stack vuelve a quedar disponible con el mismo comportamiento esperado.

---

### User Story 2 - Consumo Frontend En Entorno Orquestado (Priority: P2)

Como desarrollador funcional, quiero que el frontend en contenedor consuma correctamente el backend del mismo entorno para probar casos de uso reales de punta a punta.

**Why this priority**: Sin conectividad correcta entre frontend y backend dentro de la orquestacion, el entorno unificado no entrega valor operativo.

**Independent Test**: Con el stack levantado, abrir la UI y ejecutar al menos un flujo autenticado que confirme lectura y escritura contra la API.

**Acceptance Scenarios**:

1. **Given** los servicios levantados en la misma orquestacion, **When** el usuario interactua con la UI, **Then** las operaciones de negocio se completan consumiendo la API del stack orquestado.
2. **Given** una indisponibilidad temporal del backend, **When** la UI intenta consumir datos, **Then** el usuario recibe una respuesta clara de fallo y puede reintentar sin reiniciar todo el entorno.

---

### User Story 3 - Operacion Y Mantenimiento Simplificados (Priority: P3)

Como integrante del equipo, quiero contar con una configuracion documentada y estable de orquestacion para reducir errores de onboarding y soporte interno.

**Why this priority**: Consolida la sostenibilidad del cambio y evita que solo funcione en una maquina o para una persona.

**Independent Test**: Seguir la guia operativa desde cero en una maquina del equipo y confirmar que el entorno queda listo sin ayuda adicional.

**Acceptance Scenarios**:

1. **Given** una persona nueva en el proyecto, **When** sigue la documentacion de arranque, **Then** logra ejecutar el stack completo y acceder a la aplicacion.
2. **Given** cambios futuros en servicios del stack, **When** se mantiene la configuracion central de orquestacion, **Then** el flujo de arranque continua siendo consistente y verificable.

---

### Edge Cases

- Que ocurre cuando el puerto publico del frontend ya esta ocupado por otra aplicacion?
- Como se comporta el arranque cuando backend o base de datos tardan mas de lo esperado en estar disponibles?
- Que mensaje recibe el usuario si la UI inicia pero la API aun no responde?
- Como se valida que la configuracion de red no use rutas locales invalidas dentro de contenedores?
- Que pasa al reiniciar el stack despues de una actualizacion parcial de imagenes?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend service MUST run on Spring Boot 3.x with Java 17.
- **FR-001A**: If the feature includes web frontend scope, UI MUST run on Angular 21.x.
- **FR-002**: System MUST protect business endpoints using HTTP Basic Authentication.
- **FR-003**: System MUST authenticate baseline local credentials `admin` / `admin123`, or an equivalent documented admin identifier when login is email-based (keeping `admin123` as base local secret).
- **FR-004**: System MUST persist transactional data in PostgreSQL.
- **FR-005**: System MUST provide and maintain Swagger/OpenAPI documentation for exposed endpoints; for this feature, compliance is validated as non-regression of existing API documentation and paths.
- **FR-006**: System MUST version public API endpoints explicitly (e.g., `/api/v1/...`) or document an equivalent strategy.
- **FR-007**: System MUST be executable in Docker, including local dependency orchestration.
- **FR-008**: System MUST define deprecation policy and migration path for breaking API changes; for this feature, the policy MUST be documented and linked from operational docs.
- **FR-009**: System MUST include a dedicated frontend container build definition based on Angular production build artifacts served by Nginx so the UI can run inside the same local orchestration as backend and database.
- **FR-010**: System MUST allow full stack startup with a single orchestration command without requiring separate manual frontend startup.
- **FR-011**: System MUST expose the frontend through a documented host port so team members can access the UI directly after startup.
- **FR-012**: System MUST ensure frontend-to-backend communication works within the orchestrated network using runtime API base URL injection (startup-time configuration) without hard dependency on host-local routing assumptions or per-environment image rebuild.
- **FR-013**: System MUST preserve existing backend and database orchestration behavior while adding frontend container support.
- **FR-014**: System MUST document the unified startup and shutdown workflow for the three-service stack.
- **FR-015**: System MUST provide clear operational behavior when one service is temporarily unavailable during startup or runtime.
- **FR-016**: System MUST gate frontend container startup on a successful backend healthcheck within compose orchestration to reduce transient startup failures.
- **FR-017**: System MUST present a clear backend-unavailable status in the UI and perform controlled automatic retries with bounded backoff when API connectivity fails temporarily (2 retries with 300ms and 600ms delays).
- **FR-018**: System MUST expose only the frontend service port to the host by default, while keeping backend and database services reachable only through the internal compose network.

### Assumptions

- El entorno objetivo principal de esta mejora es desarrollo local y validacion funcional del equipo.
- El backend y la base de datos ya cuentan con definiciones de orquestacion existentes y deben mantenerse compatibles.
- El frontend ya implementa flujos funcionales para autenticacion y CRUD, por lo que esta feature se enfoca en empaquetado y ejecucion orquestada.
- El equipo acepta una ruta de acceso local documentada unica para la UI levantada por orquestacion.

### Key Entities *(include if feature involves data)*

- **Frontend Container Service**: Servicio de UI ejecutable en entorno orquestado, con atributos de build, puerto publico y dependencia operativa de API.
- **Stack Orchestration Definition**: Configuracion central de servicios y red local que coordina arranque, conectividad y disponibilidad de frontend, backend y base de datos.
- **Runtime Access Configuration**: Parametros de acceso usados por la UI para consumir API en entorno orquestado y por usuarios para acceder a la aplicacion.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de 10 arranques consecutivos del stack completo finaliza con los tres servicios disponibles usando un solo comando de orquestacion.
- **SC-002**: Al menos el 95% de las cargas iniciales de la UI en entorno orquestado permite ejecutar un flujo autenticado de lectura y al menos una operacion de escritura sin reconfiguracion manual.
- **SC-003**: El tiempo mediano de puesta en marcha full-stack para un integrante del equipo en entorno limpio se reduce al menos en 40% respecto al flujo previo.
- **SC-004**: El 100% de la guia operativa definida para inicio/parada del stack puede ser seguida por otra persona del equipo sin soporte directo.
