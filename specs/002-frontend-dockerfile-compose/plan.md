# Implementation Plan: Frontend Dockerfile Compose Integration

**Branch**: `002-frontend-dockerfile-compose` | **Date**: 2026-04-08 | **Spec**: `specs/002-frontend-dockerfile-compose/spec.md`
**Input**: Feature specification from `/specs/002-frontend-dockerfile-compose/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Integrar el frontend al stack Docker Compose existente usando Dockerfile frontend en modo build estatico + Nginx, con default de API runtime `http://app:8080`, arranque condicionado a backend saludable, exposicion publica solo del frontend en `4200`, y guia operativa reproducible sin regresiones en backend/PostgreSQL.

## Technical Context

**Language/Version**: Java 17 (backend MUST) + TypeScript 5.x (frontend MUST when web UI applies)  
**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, Docker Compose, Nginx runtime image  
**Storage**: PostgreSQL (MUST)  
**Testing**: Maven compile/build checks, Angular build checks, docker compose smoke startup validation, manual authenticated read/write flow  
**Target Platform**: Linux container runtime via Docker
**Project Type**: backend service or full-stack web app (Angular 21 + backend)  
**API Versioning Strategy**: Keep explicit versioned API paths under `/api/v1/*`  
**Performance Goals**: Align with spec SC-001..SC-004, including >=95% startups exposing UI in under 60 seconds  
**Constraints**: HTTP Basic Auth required; Swagger/OpenAPI required; Dockerized backend execution required; Angular 21 required for web frontend  
**Scale/Scope**: Local development team workflow, one-stack-per-developer startup and functional validation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: design MUST target Spring Boot 3.x on Java 17.
- Frontend gate: if feature includes web UI, design MUST target Angular 21.x.
- Security gate: protected endpoints MUST require HTTP Basic Auth.
- Data gate: persistence MUST use PostgreSQL and include migration impact analysis.
- Delivery gate: local execution MUST be reproducible with Docker/Docker Compose.
- API contract gate: endpoint changes MUST include Swagger/OpenAPI updates.
- API versioning gate: endpoints públicos MUST definir versión explícita o estrategia equivalente documentada.

Pre-Phase 0 evaluation:
- Runtime gate: PASS.
- Frontend gate: PASS.
- Security gate: PASS.
- Data gate: PASS (no schema changes expected).
- Delivery gate: PASS.
- API contract gate: PASS (non-regression requirement).
- API versioning gate: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/002-frontend-dockerfile-compose/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── Dockerfile
├── docker/
│   └── nginx/
└── src/
    └── app/
        └── core/config/

docker/
└── compose.yml

src/main/
├── java/
└── resources/

docs/
└── api-deprecation-policy.md
```

**Structure Decision**: Use the existing full-stack mono-repo layout and extend current `frontend/` and `docker/compose.yml` orchestration paths without creating new top-level projects.

## Post-Design Constitution Check

- Runtime gate: PASS. Backend remains Java 17 + Spring Boot 3.x.
- Frontend gate: PASS. Frontend remains Angular 21.x.
- Security gate: PASS. Basic Auth behavior preserved.
- Data gate: PASS. PostgreSQL unchanged, no migration impact required.
- Delivery gate: PASS. One-command compose startup is explicitly targeted.
- API contract gate: PASS. No endpoint changes; OpenAPI non-regression validation included.
- API versioning gate: PASS. `/api/v1/*` preserved.

## Phase Outputs

- `research.md`: decisions and alternatives for runtime mode, startup gating, networking defaults.
- `data-model.md`: orchestration entities and runtime state transitions.
- `contracts/docker-compose-stack.contract.yaml`: operational compose contract.
- `quickstart.md`: reproducible startup, validation, and troubleshooting guide.

## Complexity Tracking

No constitutional violations identified.
