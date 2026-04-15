# Feature Specification: Frontend Dockerfile Compose Integration

**Feature Branch**: `002-frontend-dockerfile-compose`  
**Created**: 2026-04-08  
**Status**: Draft  
**Input**: User description: "integra el dockerfile del front a mi docker compose para inicializar todo"

## Clarifications

### Session 2026-04-08

- Q: Cual debe ser el valor runtime por defecto para `API_BASE_URL` dentro de compose? -> A: `http://app:8080` usando DNS interno compose.
- Q: Que modo de runtime debe usar frontend dentro de compose? -> A: Build estatico servido por Nginx.
- Q: Como debe coordinarse el arranque de frontend respecto al backend? -> A: Frontend inicia solo cuando backend reporta healthcheck exitoso.
- Q: Que puerto de host debe usar frontend por defecto en compose? -> A: 4200.
- Q: Deben exponerse backend y PostgreSQL en host por defecto? -> A: No, solo red interna compose por defecto.

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

### User Story 1 - Arranque Unificado Del Stack (Priority: P1)

Como integrante del equipo, quiero inicializar frontend, backend y base de datos con un solo comando para tener el entorno listo sin ejecutar servicios por separado.

**Why this priority**: Resuelve el objetivo principal de la solicitud: reducir friccion de arranque y habilitar un flujo reproducible.

**Independent Test**: Desde un entorno limpio, ejecutar el comando de compose definido y validar que los tres servicios quedan operativos sin pasos manuales adicionales.

**Acceptance Scenarios**:

1. **Given** un repositorio con dependencias disponibles, **When** el usuario ejecuta el comando unico de compose, **Then** el frontend, backend y base de datos se inicializan correctamente.
2. **Given** un stack detenido previamente, **When** el usuario vuelve a iniciar compose, **Then** el entorno se recupera con comportamiento consistente.

---

### User Story 2 - Flujo Funcional Frontend-API (Priority: P2)

Como desarrollador funcional, quiero que el frontend en compose consuma la API del mismo stack para validar login y operaciones de negocio sin reconfiguraciones manuales.

**Why this priority**: Levantar servicios no aporta valor si la UI no puede operar correctamente contra la API.

**Independent Test**: Con el stack arriba, iniciar sesion y ejecutar una lectura autenticada y una escritura autenticada desde la UI.

**Acceptance Scenarios**:

1. **Given** el stack inicializado, **When** el usuario entra al frontend y se autentica, **Then** puede completar flujos de lectura y escritura contra endpoints versionados.
2. **Given** indisponibilidad temporal del backend, **When** la UI intenta consumir la API, **Then** el sistema informa el estado de forma clara y permite recuperacion sin reiniciar toda la solucion.

---

### User Story 3 - Operacion Reproducible Para Equipo (Priority: P3)

Como miembro nuevo del proyecto, quiero una guia clara para build/run/stop del stack con compose para poder trabajar sin asistencia directa.

**Why this priority**: Asegura adopcion del cambio y reduce dependencia de conocimiento tribal.

**Independent Test**: Otra persona del equipo sigue solo la documentacion y consigue levantar y detener el stack de extremo a extremo.

**Acceptance Scenarios**:

1. **Given** una maquina con Docker configurado, **When** se sigue la guia del proyecto, **Then** se puede levantar el stack completo y acceder a la UI.
2. **Given** el entorno en ejecucion, **When** se sigue la guia de apagado, **Then** los servicios se detienen de forma limpia sin dejar residuos inesperados.

---

### Edge Cases

- Puerto del frontend ya ocupado en host al iniciar compose.
- Backend tarda en quedar disponible y el frontend inicia antes de tiempo.
- Variable runtime de URL API no definida o invalida para el frontend.
- Reinicio parcial de servicios (solo frontend o solo backend) durante una sesion activa.
- Diferencias de plataforma local (Windows/Linux/macOS) que afecten rutas o permisos de startup.

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
- **FR-009**: System MUST include and use a frontend Dockerfile through docker compose so the frontend starts as part of full-stack initialization.
- **FR-009A**: System MUST run frontend in compose using static build artifacts served by Nginx.
- **FR-010**: System MUST allow full-stack startup with a single documented compose command.
- **FR-011**: System MUST expose only the required frontend host port by default and keep backend/database internal unless explicitly documented otherwise.
- **FR-011A**: System MUST keep backend and PostgreSQL without host-port exposure by default.
- **FR-012**: System MUST configure frontend runtime API access through environment-driven configuration compatible with compose startup.
- **FR-012A**: System MUST default frontend runtime API access to `http://app:8080` when running inside docker compose.
- **FR-013**: System MUST preserve existing backend and database compose behavior while adding frontend integration.
- **FR-013A**: System MUST gate frontend startup on backend healthy status in docker compose.
- **FR-014**: System MUST provide clear startup, shutdown, and troubleshooting instructions for the integrated stack.
- **FR-015**: System MUST keep frontend access available through a documented local URL after successful startup.
- **FR-015A**: System MUST publish frontend on host port 4200 by default.
- **FR-016**: System MUST keep frontend functional behavior unchanged for authenticated business flows after compose integration.

### Assumptions

- El frontend ya cuenta con Dockerfile base funcional y esta feature se centra en su integracion efectiva al compose.
- El backend y PostgreSQL ya existen en `docker/compose.yml` y no requieren rediseo arquitectonico.
- El frontend en compose resuelve API por DNS interno de servicios (`app`) y no por loopback del host.
- Backend y PostgreSQL permanecen internos por defecto; cualquier exposicion adicional se tratara como operacion excepcional documentada.
- La validacion principal se enfoca en entorno local de desarrollo del equipo.
- Las credenciales locales baseline siguen disponibles segun la politica vigente del proyecto.

### Key Entities *(include if feature involves data)*

- **Compose Stack Definition**: Define servicios, dependencias de arranque, red interna y politicas de exposicion de puertos.
- **Frontend Compose Service**: Servicio de UI integrado a compose con configuracion runtime para consumo de API.
- **Runtime Access Configuration**: Conjunto de valores de entorno y URLs locales necesarios para acceso frontend y conectividad interna.
- **Operational Runbook**: Guion de build/run/stop/diagnostico usado para onboarding y soporte interno.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de 10 ejecuciones consecutivas del arranque full-stack con el comando unico termina con servicios operativos.
- **SC-002**: Al menos el 95% de las cargas iniciales de UI permite completar login y una lectura autenticada sin reconfiguracion manual.
- **SC-003**: Al menos el 95% de los ciclos de arranque del frontend en compose deja la UI accesible en menos de 60 segundos.
- **SC-004**: El 100% de al menos 2 pruebas de onboarding interno logra build/run/stop del stack solo con documentacion.
