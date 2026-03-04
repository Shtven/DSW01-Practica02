# Implementation Plan: CRUD de Empleados

**Branch**: `001-crud-empleados` | **Date**: 2026-02-25 | **Spec**: `/specs/001-crud-empleados/spec.md`
**Input**: Feature specification from `/specs/001-crud-empleados/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar un backend CRUD de empleados con `clave` generada automáticamente en formato mixto `E` + secuencia numérica (ejemplo: `E1`, `E2`), validaciones de longitud máxima de 100 para `nombre`, `direccion` y `telefono`, eliminación física y listado paginado obligatorio (`page`, `size`).
La solución se define sobre Spring Boot 3 + Java 17 con seguridad HTTP Basic, persistencia PostgreSQL, documentación Swagger/OpenAPI y ejecución local contenerizada con Docker Compose.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Java 17 (MUST for backend work)  
**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi  
**Storage**: PostgreSQL (MUST)  
**Testing**: JUnit 5, Spring Boot Test, integration tests with PostgreSQL  
**Target Platform**: Linux container runtime via Docker
**Project Type**: backend web-service  
**Performance Goals**: p95 < 2s para operaciones CRUD válidas en ambiente funcional (alineado con SC-003)  
**Constraints**: HTTP Basic Auth required; Swagger/OpenAPI required; Dockerized execution required  
**Scale/Scope**: MVP para operación interna; hasta 10,000 empleados y 50 req/min en entorno local/QA

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: design MUST target Spring Boot 3.x on Java 17.
- Security gate: protected endpoints MUST require HTTP Basic Auth.
- Data gate: persistence MUST use PostgreSQL and include migration impact analysis.
- Delivery gate: local execution MUST be reproducible with Docker/Docker Compose.
- API contract gate: endpoint changes MUST include Swagger/OpenAPI updates.

**Gate Status (Pre-Phase 0)**: PASS

- Runtime gate: PASS (Java 17 + Spring Boot 3 definidos en contexto técnico).
- Security gate: PASS (HTTP Basic requerido para endpoints de negocio).
- Data gate: PASS (PostgreSQL + migraciones versionadas con Flyway).
- Delivery gate: PASS (arranque local con Docker Compose para app + postgres).
- API contract gate: PASS (contrato OpenAPI planificado y versionado en `contracts/`).

## Project Structure

### Documentation (this feature)

```text
specs/001-crud-empleados/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
└── main/
  ├── java/
  │   └── com/example/empleados/
  │       ├── api/
  │       ├── service/
  │       ├── domain/
  │       ├── repository/
  │       ├── config/
  │       └── EmpleadosApplication.java
  └── resources/
    ├── application.properties
    └── db/migration/

src/test/
├── java/com/example/empleados/
│   ├── unit/
│   ├── integration/
│   └── contract/
└── resources/

docker/
└── compose.yml
```

**Structure Decision**: Se adopta un único servicio backend Spring Boot con estructura Maven estándar y separación por capas (`api`, `service`, `domain`, `repository`, `config`), con pruebas por nivel y orquestación local en Docker Compose.

## Phase 0: Research Output

- Investigación consolidada en `/specs/001-crud-empleados/research.md`.
- Se resolvieron decisiones sobre generación de `clave` mixta (`E` + secuencia), persistencia PostgreSQL, paginación obligatoria, seguridad Basic Auth y ejecución con Docker.
- No quedan `NEEDS CLARIFICATION` en contexto técnico.

## Phase 1: Design & Contracts Output

- Modelo de datos en `/specs/001-crud-empleados/data-model.md`.
- Contrato API en `/specs/001-crud-empleados/contracts/empleados.openapi.yaml`.
- Guía de ejecución en `/specs/001-crud-empleados/quickstart.md`.

## Constitution Check (Post-Phase 1)

**Gate Status (Post-Design)**: PASS

- Runtime gate: PASS (artefactos diseñados para Java 17/Spring Boot 3).
- Security gate: PASS (OpenAPI declara `basicAuth` en operaciones de negocio).
- Data gate: PASS (modelo relacional PostgreSQL + migración versionada).
- Delivery gate: PASS (quickstart define arranque con Docker Compose).
- API contract gate: PASS (contrato OpenAPI versionado en `contracts/`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
