# Implementation Plan: Autenticacion por Correo de Empleado

**Branch**: `001-empleados-email-auth` | **Date**: 2026-03-11 | **Spec**: `specs/001-empleados-email-auth/spec.md`
**Input**: Feature specification from `/specs/001-empleados-email-auth/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Migrar la autenticacion HTTP Basic del backend desde `nombre + contrasena` a `correo + contrasena`, agregando el campo `correo` en `Empleado` con validacion de formato y unicidad case-insensitive. Incluir migracion de datos legacy con correo temporal determinista (`<clave>@local.invalid`), bloqueo de login para correos temporales, y flujo de reemplazo administrado por cuenta bootstrap admin con correo real configurable por entorno. Mantener contratos `/api/v1`, OpenAPI, Docker Compose y continuidad operativa de CRUD de empleados/departamentos.

## Technical Context

**Language/Version**: Java 17 (backend MUST); TypeScript/Angular no aplica en este alcance  
**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, Bean Validation, springdoc-openapi, Flyway  
**Storage**: PostgreSQL 16 con migraciones Flyway  
**Testing**: JUnit 5/Spring Boot Test + validacion manual E2E documentada en quickstart  
**Target Platform**: Linux container runtime via Docker
**Project Type**: backend web-service monolitico  
**API Versioning Strategy**: mantener rutas publicas bajo `/api/v1/...`  
**Performance Goals**: p95 < 2s en al menos 95% de operaciones autenticadas principales en entorno local/QA  
**Constraints**: HTTP Basic obligatorio; login por correo; bloqueo de correo temporal; reemplazo de correo temporal solo por administrador; OpenAPI actualizado; ejecucion Docker reproducible  
**Scale/Scope**: hasta 10,000 empleados, 500 departamentos y 50 req/min en entorno local/QA

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: PASS. El diseno se mantiene en Java 17 y Spring Boot 3.x.
- Frontend gate: PASS (N/A). La feature no introduce ni modifica UI web.
- Security gate: PASS. Se mantiene HTTP Basic en endpoints protegidos cambiando identificador de login a correo.
- Data gate: PASS. Persistencia en PostgreSQL con migracion de esquema/versionado para `correo` y backfill legacy.
- Delivery gate: PASS. Se preserva ejecucion reproducible por Docker/Docker Compose.
- API contract gate: PASS. Se actualizara contrato OpenAPI con campo `correo` y reglas de autenticacion.
- API versioning gate: PASS. La estrategia publica permanece en `/api/v1`.

## Project Structure

### Documentation (this feature)

```text
specs/001-empleados-email-auth/
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

**Structure Decision**: Se mantiene monolito backend existente para minimizar riesgo de regresiones y reutilizar seguridad, repositorios y migraciones ya implementadas en features previas.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations identified.

## Post-Design Constitution Check

- Runtime gate: PASS. Artefactos de diseno mantienen Java 17 y Spring Boot 3.x.
- Frontend gate: PASS (N/A). No hay alcance de UI en esta feature.
- Security gate: PASS. Basic Auth se conserva con login por correo y bloqueo de correos temporales.
- Data gate: PASS. Data model y research definen migracion versionada, unicidad case-insensitive y estrategia de backfill.
- Delivery gate: PASS. Quickstart mantiene flujo reproducible en Docker Compose.
- API contract gate: PASS. Contrato OpenAPI agrega `correo` y errores relevantes de autenticacion/migracion.
- API versioning gate: PASS. Contrato y quickstart sostienen `/api/v1/...`.

## Build Validation Log

- 2026-03-13: `mvn -q -DskipTests compile` ejecutado en workspace local con resultado exitoso (sin errores de compilacion).
