# Implementation Plan: GitHub Workflow Front and Back Unit Tests

**Branch**: `001-github-workflow-tests` | **Date**: 2026-04-17 | **Spec**: `specs/001-github-workflow-tests/spec.md`
**Input**: Feature specification from `/specs/001-github-workflow-tests/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Definir un workflow de GitHub Actions que se dispare en `push` y `pull_request` sobre ramas `master` y `develop`, con dos jobs de pruebas unitarias separados para frontend y backend. El flujo debe usar Node LTS para frontend y Java 17 para backend, comandos de prueba directos en el workflow, fail-fast habilitado y permisos minimos (`contents: read`).

## Technical Context

**Language/Version**: YAML (GitHub Actions), Java 17 (backend), TypeScript/Node LTS (frontend)  
**Primary Dependencies**: GitHub Actions runner, Maven Wrapper, npm scripts del frontend  
**Storage**: PostgreSQL (sin cambios en esta feature)  
**Testing**: `npm test` (frontend) y `./mvnw test` (backend) desde jobs independientes de CI  
**Target Platform**: GitHub-hosted runners Linux (`ubuntu-latest`)  
**Project Type**: Full-stack web app (Angular frontend + Spring Boot backend) con pipeline CI  
**API Versioning Strategy**: Sin cambios de endpoints; se preserva estrategia vigente `/api/v1/*`  
**Performance Goals**: Ejecucion confiable del workflow en 100% de eventos objetivo; visibilidad separada por job  
**Constraints**: Trigger solo en `master` y `develop`; exactamente dos jobs de unit tests; fail-fast habilitado; permisos minimos del token; no incluir deploy ni pruebas de integracion  
**Scale/Scope**: Un workflow de CI para validacion de cambios en PR y push de ramas principales

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: PASS. La validacion backend en CI fija Java 17.
- Frontend gate: PASS. El job de frontend ejecuta pruebas para Angular 21 usando Node LTS.
- Security gate: PASS. No se modifica el esquema de autenticacion de negocio; solo se agrega CI.
- Data gate: PASS. No hay cambios de persistencia ni migraciones PostgreSQL.
- Delivery gate: PASS. Se mejora reproducibilidad via automatizacion en GitHub Actions.
- API contract gate: PASS. No se alteran endpoints ni contratos OpenAPI.
- API versioning gate: PASS. No hay impacto en rutas versionadas de API.

## Project Structure

### Documentation (this feature)

```text
specs/001-github-workflow-tests/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── github-workflow-tests.contract.yaml
└── tasks.md
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── unit-tests.yml

frontend/
└── package.json

pom.xml
mvnw
```

**Structure Decision**: Esta feature introduce un unico archivo de workflow en `.github/workflows/` y reutiliza comandos ya existentes en `frontend/package.json` y Maven wrapper del backend, sin cambios funcionales en codigo de aplicacion.

## Post-Design Constitution Check

- Runtime gate: PASS. Diseno final incluye Java 17 para job backend.
- Frontend gate: PASS. Diseno final incluye Node LTS para job frontend.
- Security gate: PASS. Sin cambios en auth HTTP Basic de la aplicacion.
- Data gate: PASS. Sin cambios de esquema ni acceso a PostgreSQL.
- Delivery gate: PASS. CI automatica en push/PR para ramas principales.
- API contract gate: PASS. OpenAPI y contratos API no se modifican.
- API versioning gate: PASS. Versionado API permanece sin cambios.

## Phase Outputs

- `research.md`: decisiones de runtime, triggers, permisos y estrategia fail-fast.
- `data-model.md`: entidades de workflow (trigger rule, jobs, run result) y transiciones.
- `contracts/github-workflow-tests.contract.yaml`: contrato operacional del workflow CI.
- `quickstart.md`: pasos para validar disparo en push/PR y lectura de resultados por job.

## Complexity Tracking

No constitutional violations identified.
