# Implementation Plan: Autenticacion por Empleado

**Branch**: `001-empleados-auth-password` | **Date**: 2026-03-10 | **Spec**: `specs/001-empleados-auth-password/spec.md`
**Input**: Feature specification from `/specs/001-empleados-auth-password/spec.md`

## Summary

Migrar la autenticacion HTTP Basic desde credenciales fijas de aplicacion a credenciales dinamicas basadas en la entidad `Empleado` (`nombre` + `contrasena`), agregando persistencia de contrasena con hash BCrypt, normalizacion case-insensitive del login y politica minima de contrasena (8+, letra y numero). Mantener versionado `/api/v1`, contratos OpenAPI y flujo Docker sin regresiones en CRUD existente de empleados/departamentos.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, Bean Validation, springdoc-openapi, Flyway  
**Storage**: PostgreSQL 16 con migraciones Flyway  
**Testing**: JUnit 5, Spring Boot Test, validacion manual E2E del quickstart  
**Target Platform**: Contenedores Linux via Docker y Docker Compose  
**Project Type**: backend web-service monolitico  
**API Versioning Strategy**: Rutas publicas bajo `/api/v1/...`  
**Performance Goals**: p95 < 2s en al menos 95% de operaciones autenticadas principales en entorno local/QA  
**Constraints**: HTTP Basic obligatorio; autenticacion por empleado; hash BCrypt; nombre de login case-insensitive; OpenAPI actualizado; despliegue Docker reproducible  
**Scale/Scope**: hasta 10,000 empleados, 500 departamentos, 50 req/min en entorno local/QA

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: PASS. El diseno mantiene Java 17 y Spring Boot 3.x.
- Security gate: PASS. Se conserva HTTP Basic sobre endpoints protegidos, cambiando solo la fuente de identidad.
- Data gate: PASS. Cambio de esquema para `contrasena` y normalizacion de `nombre` via migracion versionada.
- Delivery gate: PASS. Se conserva ejecucion local por Docker Compose.
- API contract gate: PASS. Se actualizara contrato OpenAPI para campo `contrasena` y reglas de autenticacion.
- API versioning gate: PASS. No se altera estrategia `/api/v1`.

## Project Structure

### Documentation (this feature)

```text
specs/001-empleados-auth-password/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── empleados-auth-password.openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── main/
│   ├── java/com/example/empleados/
│   │   ├── api/
│   │   ├── config/
│   │   ├── domain/
│   │   ├── repository/
│   │   └── service/
│   └── resources/
│       ├── application.properties
│       └── db/migration/
└── test/

docker/
└── compose.yml
```

**Structure Decision**: Se mantiene la estructura actual del monolito para reducir riesgo y reutilizar la capa de seguridad/servicio ya existente.

## Complexity Tracking

No constitutional violations identified.

## Post-Design Constitution Check

- Runtime gate: PASS. Artefactos mantienen Java 17 y Spring Boot 3.x.
- Security gate: PASS. Se mantiene HTTP Basic y se endurece autenticacion con credenciales por empleado y BCrypt.
- Data gate: PASS. Se modela persistencia de contrasena y unicidad de login con migracion versionada.
- Delivery gate: PASS. Quickstart mantiene ejecucion reproducible por Docker Compose.
- API contract gate: PASS. Contrato OpenAPI actualizado con `contrasena` en payloads y restricciones de validacion.
- API versioning gate: PASS. Endpoints y quickstart mantienen rutas `/api/v1/...`.
