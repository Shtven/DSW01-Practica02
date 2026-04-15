# Implementation Plan: Gestion de Departamentos Relacionados con Empleados

**Branch**: `001-departamentos-empleados-relacion` | **Date**: 2026-03-10 | **Spec**: `specs/001-departamentos-empleados-relacion/spec.md`
**Input**: Feature specification from `/specs/001-departamentos-empleados-relacion/spec.md`

## Summary

Extender el backend actual para soportar entidad `Departamento` con `clave` autogenerada (`D` + secuencia), `nombre` con maximo 100 caracteres y relacion obligatoria 1:N con `Empleado`. Exponer CRUD versionado para departamentos, ajustar CRUD de empleados para exigir `departamentoClave` existente, bloquear eliminacion de departamentos con empleados asociados y mantener contratos OpenAPI/seguridad Basic Auth.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, Bean Validation, springdoc-openapi, Flyway  
**Storage**: PostgreSQL 16 con migraciones Flyway  
**Testing**: JUnit 5, Spring Boot Test, pruebas manuales E2E por quickstart  
**Target Platform**: Contenedores Linux via Docker y Docker Compose  
**Project Type**: backend web-service (monolito Spring Boot)  
**API Versioning Strategy**: Rutas publicas bajo `/api/v1/...`  
**Performance Goals**: p95 < 2s en al menos 95% de operaciones validas de alta/consulta en entorno local de prueba  
**Constraints**: HTTP Basic obligatorio, OpenAPI actualizado, despliegue reproducible por Docker, sin cascada para eliminacion de departamentos  
**Scale/Scope**: hasta 10,000 empleados, hasta 500 departamentos, 50 req/min en entorno local/QA

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: PASS. La implementacion mantiene Spring Boot 3.x sobre Java 17.
- Security gate: PASS. Endpoints de empleados y departamentos bajo HTTP Basic Auth.
- Data gate: PASS. Persistencia en PostgreSQL con migracion Flyway para nueva entidad/relacion.
- Delivery gate: PASS. Ejecucion local mantiene Dockerfile y Docker Compose.
- API contract gate: PASS. Se actualiza contrato OpenAPI incluyendo departamentos y campos de relacion.
- API versioning gate: PASS. Todos los endpoints nuevos permanecen en `/api/v1`.

## Project Structure

### Documentation (this feature)

```text
specs/001-departamentos-empleados-relacion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── departamentos-empleados.openapi.yaml
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

**Structure Decision**: Se mantiene estructura monolitica existente del proyecto Spring Boot para reducir riesgo de regresion y reaprovechar convenciones ya implementadas en la feature anterior.

## Complexity Tracking

No constitutional violations identified.

## Post-Design Constitution Check

- Runtime gate: PASS. El diseno y artefactos mantienen Java 17 y Spring Boot 3.x.
- Security gate: PASS. Contrato y quickstart preservan HTTP Basic para rutas de negocio.
- Data gate: PASS. Data model y research definen relacion con FK y migracion versionada.
- Delivery gate: PASS. Quickstart usa Docker Compose reproducible para entorno local.
- API contract gate: PASS. Contrato OpenAPI en `contracts/departamentos-empleados.openapi.yaml` cubre recursos modificados.
- API versioning gate: PASS. Contrato y quickstart fijan rutas bajo `/api/v1/...`.
