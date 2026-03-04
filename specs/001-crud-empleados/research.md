# Phase 0 Research - CRUD de Empleados

## 0) Employee key generation format

- Decision: Generar `clave` en formato mixto con prefijo `E` seguido de secuencia numérica (`E1`, `E2`, ...), asignada por el sistema.
- Rationale: Cumple aclaración funcional, mantiene identificadores legibles para negocio y evita entrada manual de clave.
- Alternatives considered:
  - Entero puro autoincremental: no cumple prefijo requerido.
  - Alfanumérico libre ingresado por usuario: incrementa errores y conflictos.

## 1) Performance target for MVP

- Decision: Adoptar SLO funcional de p95 < 2s para operaciones CRUD válidas en entorno local/QA.
- Rationale: Está alineado con el criterio SC-003 de la especificación y es realista para un servicio CRUD con PostgreSQL.
- Alternatives considered:
  - p95 < 500ms: demasiado agresivo para MVP sin optimización avanzada.
  - Sin SLO definido: reduce verificabilidad de calidad.

## 2) Scale and scope baseline

- Decision: Diseñar para hasta 10,000 empleados y 50 req/min en entorno local/QA.
- Rationale: Cobertura suficiente para casos académicos/administrativos iniciales sin sobrediseñar la arquitectura.
- Alternatives considered:
  - Escala masiva (millones): incrementa complejidad prematuramente.
  - Escala no declarada: impide validar decisiones de paginación y consultas.

## 3) Persistence and schema evolution

- Decision: PostgreSQL como almacenamiento principal con migraciones versionadas por Flyway.
- Rationale: Cumple constitución y facilita trazabilidad/rollback de cambios de esquema.
- Alternatives considered:
  - Solo `ddl-auto`: insuficiente para control de cambios en equipo.
  - Liquibase: válido, pero Flyway mantiene configuración más simple para este alcance.

## 4) Authentication strategy

- Decision: HTTP Basic Authentication para endpoints de negocio; credenciales base `admin/admin123` en local.
- Rationale: Es requisito constitucional y funcional mínimo para proteger operaciones CRUD.
- Alternatives considered:
  - JWT/OAuth2: más robusto pero innecesario para MVP actual.
  - Sin autenticación: incumple constitución.

## 5) API contract and pagination pattern

- Decision: OpenAPI 3.0 con endpoints REST `/api/empleados` y paginación obligatoria por `page` y `size`.
- Rationale: Evita ambigüedad de consumo, previene respuestas no acotadas y mantiene compatibilidad con decisiones de clarificación.
- Alternatives considered:
  - Paginación opcional: comportamiento menos predecible.
  - Sin contrato OpenAPI: incumple constitución.

## 6) Docker execution model

- Decision: Docker Compose para levantar `app` + `postgres` en desarrollo local.
- Rationale: Reproduce entorno de forma consistente y cumple gate de entrega contenerizada.
- Alternatives considered:
  - Solo ejecución local sin Docker: mayor deriva entre entornos.
  - Kubernetes desde inicio: complejidad innecesaria para MVP.
