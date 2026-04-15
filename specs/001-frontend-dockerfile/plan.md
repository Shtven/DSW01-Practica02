# Implementation Plan: Frontend Dockerfile Startup

**Branch**: `001-frontend-dockerfile` | **Date**: 2026-04-07 | **Spec**: `specs/001-frontend-dockerfile/spec.md`
**Input**: Feature specification from `specs/001-frontend-dockerfile/spec.md`

## Summary

Crear un Dockerfile dedicado para el frontend Angular 21 que arranque con `ng serve`, con puerto configurable por entorno (default `4200`), `API_BASE_URL` obligatoria en runtime y politica de reinicio acotada `on-failure`, junto con documentacion reproducible de build/run sin cambios obligatorios en `docker/compose.yml`.

## Technical Context

**Language/Version**: Java 17 (backend existente), TypeScript 5.9.x + Angular 21.2.x (frontend), Dockerfile syntax  
**Primary Dependencies**: Angular CLI 21 (`ng serve`), Node.js runtime image para contenedor frontend, Spring Boot 3.3.x API existente  
**Storage**: PostgreSQL (existente; sin cambios de esquema en esta feature)  
**Testing**: `npm run build` (frontend), smoke runtime de contenedor (`docker build` + `docker run`), validacion manual login + lectura en UI  
**Target Platform**: Docker local Linux containers  
**Project Type**: Full-stack web app con alcance de implementacion acotado al frontend containerization  
**API Versioning Strategy**: Mantener consumo de endpoints versionados existentes ` /api/v1/* `  
**Performance Goals**: SC-001..SC-004 del spec, incluyendo startup <60s en >=95% de 20 inicios y onboarding reproducible  
**Constraints**: `ng serve` en runtime, `API_BASE_URL` obligatoria con fail-fast, puerto configurable default `4200`, politica de reinicio acotada, sin cambios obligatorios en `docker/compose.yml`  
**Scale/Scope**: Desarrollo local y validacion funcional de equipo pequeno

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- Runtime gate: PASS. No se altera baseline Spring Boot 3.x / Java 17.
- Frontend gate: PASS. Solucion basada en Angular 21.x existente.
- Security gate: PASS. No modifica esquema de auth de endpoints de negocio.
- Data gate: PASS. Sin cambios de persistencia ni migraciones.
- Delivery gate: PASS. Mejora reproducibilidad Docker para frontend.
- API contract gate: PASS. No se agregan/modifican endpoints; solo consumo existente.
- API versioning gate: PASS. Se preserva ` /api/v1 ` en integracion frontend.

### Post-Phase 1 Gate Review

- Runtime gate: PASS. Diseno mantiene stack base y agrega solo artefactos frontend Docker.
- Frontend gate: PASS. Build y run orientados a Angular 21 + CLI.
- Security gate: PASS. No relaja Basic Auth ni credenciales baseline.
- Data gate: PASS. Ningun impacto en PostgreSQL/Flyway.
- Delivery gate: PASS. Quickstart y contrato operativo cubren ejecucion reproducible.
- API contract gate: PASS. Validacion de no-regresion OpenAPI incluida como criterio de ejecucion.
- API versioning gate: PASS. Se mantiene consumo hacia rutas versionadas.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-dockerfile/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── frontend-dockerfile-runtime.contract.yaml
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── package.json
├── angular.json
├── src/
│   ├── app/
│   └── environments/
└── Dockerfile          # New in this feature

docker/
└── compose.yml         # Optional integration, not mandatory for acceptance

src/main/
└── java/com/example/empleados/   # Existing backend (no required changes)
```

**Structure Decision**: Se adopta la estructura web app existente; la implementacion se limita a `frontend/` y documentacion en `specs/001-frontend-dockerfile/`, con integracion compose opcional.

## Phase 0 Output

- Research completed in `specs/001-frontend-dockerfile/research.md` with all clarification-driven decisions resolved.

## Phase 1 Output

- Data model completed in `specs/001-frontend-dockerfile/data-model.md`.
- Runtime/interface contract completed in `specs/001-frontend-dockerfile/contracts/frontend-dockerfile-runtime.contract.yaml`.
- Execution guide completed in `specs/001-frontend-dockerfile/quickstart.md`.
- Agent context updated via `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`.

## Complexity Tracking

No constitutional violations identified; no additional complexity justification required.
