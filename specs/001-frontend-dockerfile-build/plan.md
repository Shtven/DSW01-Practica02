# Implementation Plan: Frontend Dockerfile Simplification

**Branch**: `001-frontend-dockerfile-build` | **Date**: 2026-04-13 | **Spec**: `C:/Users/gdemg/OneDrive/Documentos/gabriel/DSW01-Practica02/specs/001-frontend-dockerfile-build/spec.md`
**Input**: Feature specification from `/specs/001-frontend-dockerfile-build/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Eliminar la carpeta `frontend/docker` y centralizar el build/runtime del frontend en un unico `frontend/Dockerfile` con build estatico y servidor web en runtime. Mantener compatibilidad con Docker Compose local: frontend publicado en `4200`, backend y PostgreSQL internos por defecto, y `API_BASE_URL` obligatorio (sin default implicito).

## Implementation Baseline Notes

- Feature scope confirmed as containerization and docs alignment only; no API contract redesign.
- Mandatory runtime config policy confirmed: no implicit default for `API_BASE_URL` at startup.
- Compose defaults confirmed: frontend exposed at `4200`, backend/db internal-only by default.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Java 17 (backend), TypeScript 5.x (frontend Angular 21)  
**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, Docker Compose, Nginx runtime image  
**Storage**: PostgreSQL (sin cambio funcional)  
**Testing**: Docker build frontend, smoke tests de compose, validacion de no-regresion API (auth/versionado/swagger)  
**Target Platform**: Linux containers ejecutados con Docker/Compose en entorno local de desarrollo  
**Project Type**: Full-stack web app (backend + frontend)  
**API Versioning Strategy**: Mantener versionado explicito existente bajo `/api/v1/*` sin cambios de contrato  
**Performance Goals**: Startup frontend deterministico; fallo explicito por configuracion obligatoria faltante en <=30s  
**Constraints**: `API_BASE_URL` obligatorio en runtime; eliminar fisicamente `frontend/docker`; frontend host port default `4200`; backend y DB internos por defecto en compose  
**Scale/Scope**: Alcance local-dev para una instancia de stack completa (frontend+backend+postgres)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: design MUST target Spring Boot 3.x on Java 17.
- Frontend gate: if feature includes web UI, design MUST target Angular 21.x.
- Security gate: protected endpoints MUST require HTTP Basic Auth.
- Data gate: persistence MUST use PostgreSQL and include migration impact analysis.
- Delivery gate: local execution MUST be reproducible with Docker/Docker Compose.
- API contract gate: endpoint changes MUST include Swagger/OpenAPI updates.
- API versioning gate: endpoints públicos MUST definir versión explícita o estrategia equivalente documentada.

Pre-Phase 0 gate result: PASS
- Runtime/Frontend: sin cambios de stack base.
- Security/Data/API: cambios de contenedorizacion sin alteracion de endpoints ni credenciales baseline.
- Delivery: feature enfocada en simplificar build/run local con Docker.

Post-Phase 1 gate result: PASS
- Artefactos de diseno mantienen Basic Auth, PostgreSQL, Swagger y `/api/v1/*` como no-regresion.
- Contrato de compose define exposicion frontend `4200` y backend/DB internos por defecto.
- Quickstart exige configuracion runtime explicita para `API_BASE_URL`.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-dockerfile-build/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── frontend-compose.contract.yaml
└── tasks.md
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
Dockerfile
docker/
  compose.yml
frontend/
  Dockerfile
  nginx/
    default.conf.template
    docker-entrypoint.sh
  src/
  public/
    runtime-config.template.json
  package.json
src/
  main/
    java/
    resources/
```

**Structure Decision**: Se usa estructura web app existente del repositorio. El cambio se concentra en `frontend/` y `docker/compose.yml` para eliminar acoplamiento a `frontend/docker` y mantener interoperabilidad con backend Java y PostgreSQL ya existentes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
