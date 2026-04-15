# Implementation Plan: Front Angular Consume API REST

**Branch**: `001-angular-api-integration` | **Date**: 2026-03-24 | **Spec**: `specs/001-angular-api-integration/spec.md`
**Input**: Feature specification from `/specs/001-angular-api-integration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar una SPA Angular 21 en un nuevo modulo `frontend/` que consuma el API REST existente (`/api/v1/empleados` y `/api/v1/departamentos`) mediante HTTP Basic Auth. La UI cubrira login por sesion activa, listados paginados, CRUD de empleados y departamentos con manejo consistente de errores, estados de carga y reintentos solo para lecturas GET. La integracion respetara contrato OpenAPI/versionado vigente y entorno local reproducible junto al backend Dockerizado.

## Technical Context

**Language/Version**: Java 17 (backend MUST) + TypeScript 5.x (frontend MUST when web UI applies)  
**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, RxJS, Angular HttpClient  
**Storage**: PostgreSQL (MUST)  
**Testing**: JUnit 5/Spring Boot Test (backend existente), pruebas funcionales frontend (manual guiada en quickstart)  
**Target Platform**: Linux container runtime via Docker
**Project Type**: backend service or full-stack web app (Angular 21 + backend)  
**API Versioning Strategy**: consumir unicamente endpoints versionados bajo `/api/v1/...`  
**Performance Goals**: p95 < 2s para consultas principales (listados empleados/departamentos) en entorno local/QA  
**Constraints**: HTTP Basic Auth required; Swagger/OpenAPI required; Dockerized backend execution required; Angular 21 required for web frontend  
**Scale/Scope**: entorno local/QA con hasta 50 req/min, 10k empleados y 500 departamentos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: design MUST target Spring Boot 3.x on Java 17.
- Frontend gate: if feature includes web UI, design MUST target Angular 21.x.
- Security gate: protected endpoints MUST require HTTP Basic Auth.
- Data gate: persistence MUST use PostgreSQL and include migration impact analysis.
- Delivery gate: local execution MUST be reproducible with Docker/Docker Compose.
- API contract gate: endpoint changes MUST include Swagger/OpenAPI updates.
- API versioning gate: endpoints publicos MUST definir version explicita o estrategia equivalente documentada.

Evaluacion inicial: PASS en todos los gates. No se requieren excepciones constitucionales.

## Project Structure

### Documentation (this feature)

```text
specs/001-angular-api-integration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
└── main/java/com/example/empleados/...

frontend/
├── src/app/
│   ├── core/
│   ├── auth/
│   ├── empleados/
│   ├── departamentos/
│   └── shared/
└── src/environments/

docker/
└── compose.yml
```

**Structure Decision**: Se adopta estructura full-stack manteniendo backend en `src/` y agregando `frontend/` para Angular 21. Esto minimiza impacto sobre backend existente y separa claramente responsabilidades de UI/consumo API.

## Complexity Tracking

No constitutional violations identified.

## Post-Design Constitution Check

- Runtime gate: PASS. Backend permanece en Java 17/Spring Boot 3.x y frontend objetivo Angular 21.
- Frontend gate: PASS. La UI propuesta es SPA Angular 21 con estructura dedicada.
- Security gate: PASS. Se mantiene HTTP Basic para endpoints protegidos y sesion frontend no persistente.
- Data gate: PASS. No se altera modelo PostgreSQL; se consume esquema/contrato vigente.
- Delivery gate: PASS. Quickstart define ejecucion local reproducible con Docker Compose + frontend dev server.
- API contract gate: PASS. Se define contrato de consumo frontend alineado con OpenAPI existente.
- API versioning gate: PASS. Solo se consumen rutas `/api/v1/...`.

## Phase Outputs

- `research.md`: decisiones de integracion frontend-backend y tradeoffs.
- `data-model.md`: modelo de vistas/estado UI y transiciones.
- `contracts/angular-api-integration.openapi.yaml`: contrato de consumo de endpoints por la SPA.
- `quickstart.md`: guia de validacion E2E para login, listados y CRUD desde Angular.
