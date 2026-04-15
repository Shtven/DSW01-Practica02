# Feature Specification: Nginx Compose Proxy Integration

**Feature Branch**: `001-nginx-compose-proxy`  
**Created**: 2026-04-14  
**Status**: Draft  
**Input**: User description: "necesito que agregues el nginx a mi docker compose y un proxy"

## Clarifications

### Session 2026-04-14

- Q: Que rol debe cumplir Nginx en el punto de entrada del stack? -> A: Opcion B, Nginx como puerta unica: sirve frontend y proxea API.
- Q: Como debe organizarse el ruteo publico en Nginx? -> A: Opcion A, frontend en `/` y API en `/api/*`, preservando `/api/v1/*`.
- Q: Cual debe ser la politica de exposicion de puertos en host? -> A: Opcion A, solo Nginx publico; backend y PostgreSQL internos por defecto.
- Q: Como debe comportarse Nginx si backend no esta disponible temporalmente? -> A: Opcion A, mantener frontend en `/` y devolver error controlado para `/api/*`.

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

### User Story 1 - Arranque Unico Con Nginx (Priority: P1)

Como integrante del equipo, quiero levantar el stack con Nginx incluido en Docker Compose para tener un unico punto de entrada web que sirva frontend y enrute API sin configuraciones manuales adicionales.

**Why this priority**: Habilita el resultado principal solicitado: Compose con Nginx operativo desde el inicio.

**Independent Test**: Ejecutar un solo comando de arranque del stack y verificar que Nginx queda disponible y responde como entrada principal del sistema.

**Acceptance Scenarios**:

1. **Given** un entorno limpio con Docker disponible, **When** se inicia el compose del proyecto, **Then** Nginx, backend y base de datos quedan operativos dentro del mismo stack.
2. **Given** el stack en ejecucion, **When** un usuario accede al endpoint publico definido, **Then** obtiene frontend y acceso a API a traves de Nginx sin acceder directamente a servicios internos.

---

### User Story 2 - Proxy Hacia API (Priority: P2)

Como desarrollador funcional, quiero que Nginx actue como proxy hacia la API para ejecutar flujos autenticados sin exponer el backend directamente al host.

**Why this priority**: Sin proxy funcional, Nginx no aporta valor real para rutas de negocio ni simplifica el consumo desde cliente.

**Independent Test**: Con el stack levantado, invocar rutas de API a traves de Nginx y confirmar respuesta correcta, incluyendo casos autenticados y no autenticados.

**Acceptance Scenarios**:

1. **Given** Nginx en ejecucion con configuracion de proxy, **When** una solicitud de API llega por el endpoint publico, **Then** la solicitud se enruta al backend correcto sin cambios manuales de direccionamiento.
2. **Given** una solicitud sin credenciales validas, **When** se procesa a traves del proxy, **Then** se preserva el comportamiento de seguridad esperado de la API.

---

### User Story 3 - Operacion Documentada Del Proxy (Priority: P3)

Como miembro nuevo del proyecto, quiero una guia clara de arranque y verificacion del proxy Nginx para trabajar sin soporte directo del equipo.

**Why this priority**: Reduce errores de onboarding y asegura que la integracion sea reproducible por cualquier integrante.

**Independent Test**: Seguir la documentacion desde cero y completar arranque, validacion de proxy y apagado del stack sin ayuda externa.

**Acceptance Scenarios**:

1. **Given** una persona que no participo en la implementacion, **When** sigue la guia oficial, **Then** logra validar el proxy funcionando de extremo a extremo.

---

### Edge Cases

- Nginx inicia antes de que backend este listo y debe manejar temporalmente errores sin romper el arranque global.
- Conflicto de puerto del endpoint publico de Nginx con otro proceso local.
- Ruta de API inexistente solicitada via proxy debe devolver error coherente sin filtrar informacion sensible.
- Configuracion invalida del destino de proxy debe ser detectable con mensaje operativo claro.
- Reinicio de backend durante sesion activa debe permitir recuperacion del flujo una vez restablecido.

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
- **FR-009**: System MUST include an Nginx service in Docker Compose as part of default full-stack startup.
- **FR-010**: System MUST configure Nginx to proxy API requests to the internal backend service using compose service discovery.
- **FR-011**: System MUST keep backend and database internal by default (no host port exposure) unless explicitly overridden.
- **FR-011A**: System MUST use Nginx as the single documented public entry point to serve frontend assets and route API traffic.
- **FR-011B**: System MUST expose frontend content at `/` and route API traffic through `/api/*` while preserving existing versioned API paths under `/api/v1/*`.
- **FR-011C**: System MUST publish only the Nginx service to host by default, keeping backend and PostgreSQL without host port exposure unless explicitly overridden.
- **FR-012**: System MUST preserve API authentication behavior when traffic passes through Nginx proxy.
- **FR-013**: System MUST preserve explicit API versioning paths under `/api/v1/*` when accessed through proxy routes.
- **FR-014**: System MUST provide documented startup, verification, and shutdown steps for the Nginx proxy flow.
- **FR-015**: System MUST provide troubleshooting guidance for proxy startup failures and upstream connectivity issues.
- **FR-016**: System MUST keep frontend static content available at `/` during temporary backend unavailability and return a controlled proxy error for `/api/*` requests with HTTP 502 or 503 and an explicit machine-readable payload.

### Assumptions

- El backend y PostgreSQL ya existen en `docker/compose.yml` y solo se ampliara la orquestacion con Nginx/proxy.
- El flujo de autenticacion actual del backend debe mantenerse sin rediseo de seguridad en esta feature.
- El objetivo principal es entorno local de desarrollo y validacion funcional del equipo.
- No se requieren nuevos endpoints de negocio; solo enrutamiento y exposicion mediante proxy.

### Key Entities *(include if feature involves data)*

- **Compose Proxy Service**: Servicio Nginx orquestado que expone el punto de entrada publico del stack.
- **Proxy Routing Rule**: Regla que mapea rutas publicas hacia destinos internos del stack, incluyendo API versionada.
- **Upstream Backend Endpoint**: Destino interno alcanzable por Nginx para atender solicitudes de negocio.
- **Operational Runbook**: Guia que define como iniciar, validar y detener el stack con proxy.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de 10 arranques consecutivos del stack con un solo comando finaliza con Nginx, backend y base de datos en estado operativo.
- **SC-002**: Al menos el 95% de 20 solicitudes de API realizadas a traves de Nginx proxy devuelve la respuesta esperada sin reconfiguracion manual entre intentos.
- **SC-003**: El 100% de las verificaciones de seguridad definidas para accesos no autenticados mantiene el resultado esperado al pasar por el proxy.
- **SC-004**: Al menos 2 integrantes del equipo completan onboarding operativo (arranque, prueba de proxy y apagado) usando solo la documentacion y con tasa de exito del 100%.
