# Implementation Plan: Proxy Compose Solo Frontend Puerto 80

**Branch**: `001-frontend-proxy-compose` | **Date**: 2026-04-15 | **Spec**: `specs/001-frontend-proxy-compose/spec.md`
**Input**: Feature specification from `specs/001-frontend-proxy-compose/spec.md`

## Summary

Ajustar la orquestacion Docker Compose para que el unico puerto publicado al host sea el 80 del servicio proxy (Nginx de frontend), manteniendo backend y base de datos solo en red interna de Docker. El proxy debe entregar respuestas HTTP estandar (502/504) en rutas `/api/*` cuando el upstream backend no este disponible, sin pagina personalizada, y el alcance se mantiene en HTTP sin TLS.

## Technical Context

**Language/Version**: Java 17 (backend), TypeScript (Angular frontend), YAML (Docker Compose y Nginx templates)  
**Primary Dependencies**: Spring Boot 3.x backend, Angular frontend containerizado con Nginx, Docker Compose v2  
**Storage**: PostgreSQL 16 en contenedor interno  
**Testing**: Validaciones de smoke por `curl`, verificacion de puertos expuestos y pruebas funcionales basicas del frontend a traves de proxy  
**Target Platform**: Entorno local Docker Desktop/Engine en Windows/Linux con runtime Linux containers  
**Project Type**: Full-stack web app (frontend + backend + DB) orquestada por Compose  
**API Versioning Strategy**: Mantener estrategia vigente `/api/v1/...` ya consumida a traves del proxy  
**Performance Goals**: Sin SLO adicional de rendimiento en esta feature; se valida el criterio operativo temporal definido en SC-004 del spec  
**Constraints**: Solo HTTP puerto 80 expuesto; sin TLS en este alcance; backend y DB no publicados al host; autenticacion Basic Auth backend sin cambios  
**Scale/Scope**: Uso local de desarrollo/demo; una instancia de cada servicio (postgres, app, nginx)

## Constitution Check (Pre-Research)

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Runtime gate: PASS. No cambios de runtime; backend se mantiene en Spring Boot 3.x sobre Java 17.
- Frontend gate: PASS. Frontend sigue en Angular con entrega via Nginx.
- Security gate: PASS. No se reduce seguridad de endpoints; se mantiene Basic Auth en backend.
- Data gate: PASS. No hay cambios de persistencia ni esquema PostgreSQL.
- Delivery gate: PASS. La solucion se implementa en Docker Compose reproducible.
- API contract gate: PASS. No hay cambio de contratos API de negocio ni nuevos endpoints.
- API versioning gate: PASS. Se preserva enrutamiento hacia endpoints versionados existentes.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-proxy-compose/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
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
└── public/
    ├── runtime-config.json
    └── runtime-config.template.json

src/
└── main/
    ├── java/
    └── resources/

docs/
└── frontend-dockerfile-runbook.md
```

**Structure Decision**: Se usa la estructura full-stack existente del repositorio, concentrando los cambios funcionales en `docker/compose.yml` y, solo si aplica, ajustes menores en plantillas Nginx del frontend. No se crean nuevos modulos de aplicacion.

## Phase 0 - Research Output Reference

- Documento generado: `specs/001-frontend-proxy-compose/research.md`
- Estado: Completo, sin NEEDS CLARIFICATION pendientes.

## Phase 1 - Design Output Reference

- Modelo de datos operativo: `specs/001-frontend-proxy-compose/data-model.md`
- Contrato de interfaz externa: `specs/001-frontend-proxy-compose/contracts/proxy-exposure-contract.md`
- Guia de verificacion: `specs/001-frontend-proxy-compose/quickstart.md`

## Constitution Check (Post-Design)

- Runtime gate: PASS.
- Frontend gate: PASS.
- Security gate: PASS.
- Data gate: PASS.
- Delivery gate: PASS.
- API contract gate: PASS.
- API versioning gate: PASS.

Resultado: Sin violaciones constitucionales ni excepciones requeridas.

## Complexity Tracking

No se requieren justificaciones de complejidad; no existen violaciones de gates.
