# Implementation Plan: Nginx Compose Proxy Integration

**Branch**: `001-nginx-compose-proxy` | **Date**: 2026-04-14 | **Spec**: `specs/001-nginx-compose-proxy/spec.md`
**Input**: Feature specification from `/specs/001-nginx-compose-proxy/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Integrar Nginx como unico punto de entrada publico del stack Docker Compose para servir frontend en `/` y proxy de API en `/api/*`, preservando rutas `/api/v1/*`, autenticacion Basic Auth y comportamiento del backend/PostgreSQL sin exposicion directa al host. Se incluira manejo de indisponibilidad temporal del backend con frontend disponible y error controlado para API.

## Technical Context

**Language/Version**: Java 17 (backend) + TypeScript 5.x (frontend Angular 21)  
**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, Nginx 1.27 (container)  
**Storage**: PostgreSQL 16 (compose service `postgres`)  
**Testing**: Docker Compose smoke tests, authenticated API checks through proxy, OpenAPI availability checks, manual runbook onboarding validation  
**Target Platform**: Linux container runtime via Docker Compose local
**Project Type**: Full-stack web app (Angular frontend + Spring Boot backend + PostgreSQL)  
**API Versioning Strategy**: Preserve explicit versioned paths under `/api/v1/*` behind Nginx `/api/*` route  
**Performance Goals**: Complete startup of stack with proxy in deterministic local workflow; controlled error response for API while backend is unavailable  
**Constraints**: HTTP Basic Auth required; Swagger/OpenAPI required; backend and database internal-only by default; Nginx as single public entry point  
**Scale/Scope**: Local developer environment with one compose stack, focused on reproducibility and integration behavior

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: design targets Spring Boot 3.x on Java 17. PASS
- Frontend gate: web UI remains Angular 21.x. PASS
- Security gate: protected endpoints keep HTTP Basic Auth behavior through proxy. PASS
- Data gate: PostgreSQL remains storage backend with no schema migration required. PASS
- Delivery gate: local execution remains reproducible with Docker Compose. PASS
- API contract gate: no endpoint redesign; OpenAPI accessibility preserved as non-regression requirement. PASS
- API versioning gate: `/api/v1/*` preserved behind proxied `/api/*` path. PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-nginx-compose-proxy/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── nginx-compose-proxy.contract.yaml
└── tasks.md
```

### Source Code (repository root)

```text
docker/
└── compose.yml

frontend/
├── Dockerfile
├── nginx/
│   ├── default.conf.template
│   └── docker-entrypoint.sh
├── public/
│   └── runtime-config.template.json
└── src/

src/
└── main/
    ├── java/
    └── resources/

docs/
├── api-deprecation-policy.md
└── frontend-dockerfile-runbook.md
```

**Structure Decision**: Use existing monorepo full-stack layout. Implementation will primarily adjust `docker/compose.yml` and Nginx runtime configuration under `frontend/nginx/`, while keeping backend code and persistence model unchanged.

## Complexity Tracking

No constitutional violations identified.

## Post-Design Constitution Check

- Runtime gate: PASS. Backend remains Spring Boot 3.x on Java 17.
- Frontend gate: PASS. Frontend remains Angular 21.x.
- Security gate: PASS. Basic Auth behavior is preserved through proxy path.
- Data gate: PASS. PostgreSQL remains unchanged and no migration is needed.
- Delivery gate: PASS. One-command Docker Compose startup is documented and reproducible.
- API contract gate: PASS. No endpoint redesign; OpenAPI availability is retained as a validation target.
- API versioning gate: PASS. `/api/v1/*` remains explicit and preserved behind `/api/*` proxy routing.

## Phase Outputs

- `research.md`: Nginx gateway, routing, exposure, failure-behavior, and non-regression decisions.
- `data-model.md`: compose/proxy entities, validation rules, and runtime state transitions.
- `contracts/nginx-compose-proxy.contract.yaml`: operational ingress/proxy contract for compose services.
- `quickstart.md`: startup, validation, outage behavior checks, and troubleshooting runbook.
