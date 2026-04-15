# Implementation Plan: Frontend Docker Compose Integration

**Branch**: `001-frontend-dockerfile-compose` | **Date**: 2026-04-07 | **Spec**: `specs/001-frontend-dockerfile-compose/spec.md`
**Input**: Feature specification from `specs/001-frontend-dockerfile-compose/spec.md`

## Summary

Integrar el frontend Angular al stack Docker Compose existente mediante un Dockerfile dedicado (build de produccion + Nginx), configuracion runtime de `apiBaseUrl`, arranque coordinado por healthcheck del backend, y exposicion minima de puertos (solo frontend publico), manteniendo sin regresiones el comportamiento actual de backend y PostgreSQL.

## Technical Context

**Language/Version**: Java 17 (backend), TypeScript 5.9.x (frontend), Docker Compose spec  
**Primary Dependencies**: Spring Boot 3.3.x, Spring Security (Basic Auth), Spring Data JPA, Flyway, PostgreSQL 16, Angular 21.2.x, Nginx (frontend static serving)  
**Storage**: PostgreSQL (contenedor `postgres`)  
**Testing**: Maven tests (`mvn test`), Angular build smoke (`npm run build`), Compose smoke checks (`docker compose up`, health/status checks), manual authenticated UI flow  
**Target Platform**: Linux containers via Docker / Docker Compose local development  
**Project Type**: Full-stack web application (Spring Boot API + Angular SPA)  
**API Versioning Strategy**: Mantener endpoints versionados ` /api/v1/* ` ya existentes; no introducir endpoints sin version  
**Performance Goals**: Cumplir SC del spec: 10/10 arranques exitosos, >=95% carga inicial util con flujo autenticado, reducir tiempo mediano de puesta en marcha >=40% vs flujo previo  
**Constraints**: Basic Auth obligatorio, Swagger/OpenAPI vigente, PostgreSQL obligatorio, Docker reproducible, Angular 21 obligatorio para frontend, frontend en Nginx, inyeccion runtime de URL API  
**Scale/Scope**: Entorno de desarrollo local para equipo pequeno (onboarding y pruebas E2E), trafico bajo/medio no productivo, un stack por desarrollador

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- Runtime gate: PASS. Se mantiene Spring Boot 3.x + Java 17.
- Frontend gate: PASS. Se mantiene Angular 21.x.
- Security gate: PASS. No se altera Basic Auth en endpoints de negocio.
- Data gate: PASS. PostgreSQL sigue como persistencia; no hay cambios de esquema requeridos para esta feature.
- Delivery gate: PASS. La entrega apunta a Docker Compose con arranque unificado.
- API contract gate: PASS. Esta feature no modifica contratos de endpoints; OpenAPI existente permanece vigente.
- API versioning gate: PASS. Se preserva estrategia ` /api/v1 `.

### Post-Phase 1 Gate Review

- Runtime gate: PASS. Diseno de compose/frontend no altera baseline Java/Spring.
- Frontend gate: PASS. Build/runtime frontend mantiene Angular 21.
- Security gate: PASS. Mantiene autenticacion y no expone backend al host por defecto.
- Data gate: PASS. Sin cambios de modelo o migraciones; impacto documentado como nulo.
- Delivery gate: PASS. Quickstart define flujo reproducible de arranque/parada.
- API contract gate: PASS. Se agrega contrato operativo de orquestacion sin romper OpenAPI funcional.
- API versioning gate: PASS. Integracion frontend continua consumiendo ` /api/v1/* `.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-dockerfile-compose/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── docker-compose-stack.contract.yaml
└── tasks.md
```

### Source Code (repository root)

```text
Dockerfile
docker/
└── compose.yml

src/
└── main/
    ├── java/com/example/empleados/
    └── resources/

frontend/
├── package.json
├── angular.json
├── src/
│   ├── app/
│   └── environments/
└── public/
```

**Structure Decision**: Se usa estructura full-stack existente en un unico repositorio (backend en `src/main`, frontend en `frontend/`, orquestacion en `docker/compose.yml`). No se crean subproyectos adicionales.

## Phase 0 Output

- Research completed in `specs/001-frontend-dockerfile-compose/research.md`.
- Todas las aclaraciones tecnicas relevantes quedaron resueltas sin pendientes bloqueantes.

## Phase 1 Output

- Data model documented in `specs/001-frontend-dockerfile-compose/data-model.md`.
- Operational contract documented in `specs/001-frontend-dockerfile-compose/contracts/docker-compose-stack.contract.yaml`.
- Startup/validation guide documented in `specs/001-frontend-dockerfile-compose/quickstart.md`.
- Agent context updated by script (`update-agent-context.ps1 -AgentType copilot`).

## Complexity Tracking

No constitutional violations identified. Tabla no requerida para esta feature.
