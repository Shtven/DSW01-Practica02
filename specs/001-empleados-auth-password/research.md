# Phase 0 Research - Autenticacion por Empleado

## 1) Algoritmo de hash de contrasena

- Decision: Usar BCrypt para almacenar y validar contrasenas de empleados.
- Rationale: Integracion nativa y madura con Spring Security, facilidad de mantenimiento y costo adecuado para el alcance.
- Alternatives considered:
  - Argon2id: mayor dureza criptografica pero complejidad operativa innecesaria para este alcance.
  - PBKDF2: valido pero menos directo en el stack actual.

## 2) Estrategia de login por nombre

- Decision: Tratar `nombre` como identificador de login case-insensitive, normalizado a minusculas en persistencia y consulta.
- Rationale: Evita duplicados semanticos (`Juan` vs `juan`) y reduce errores de autenticacion.
- Alternatives considered:
  - Case-sensitive: experiencia de uso friccionada.
  - Preservar formato original con comparacion flexible solo en runtime: mas ambiguedad y riesgo de inconsistencias.

## 3) Politica minima de contrasena

- Decision: Exigir minimo 8 caracteres con al menos una letra y un numero en alta/actualizacion.
- Rationale: Balancea seguridad y simplicidad operativa.
- Alternatives considered:
  - Solo no vacia: seguridad insuficiente.
  - Politica muy estricta (12+ y simbolos): costo de adopcion mayor para alcance actual.

## 4) Integracion con HTTP Basic actual

- Decision: Mantener HTTP Basic y reemplazar provider de autenticacion para resolver usuarios desde `Empleado`.
- Rationale: Cumple constitucion y minimiza impacto sobre clientes/infraestructura.
- Alternatives considered:
  - Migrar a JWT/OAuth2: fuera de alcance solicitado.
  - Mantener usuario fijo de aplicacion: contradice requisito principal.

## 5) Persistencia y migracion de datos

- Decision: Agregar columna `contrasena` en `empleados` y definir indice/constraint de unicidad para `nombre` normalizado.
- Rationale: Garantiza login univoco y trazabilidad de cambios via Flyway.
- Alternatives considered:
  - Sin restriccion de unicidad: riesgo de identidades ambiguas.
  - Tabla separada de credenciales: complejidad extra sin beneficio inmediato para alcance.

## 6) Contrato API y compatibilidad

- Decision: Actualizar contratos OpenAPI para reflejar `contrasena` en payloads de alta/actualizacion y conservar rutas `/api/v1`.
- Rationale: Mantiene versionado constitucional y minimiza breaking changes fuera del campo nuevo obligatorio.
- Alternatives considered:
  - Crear `/api/v2`: no necesario para el alcance actual.
  - Omitir contrato: incumple gates de calidad.
