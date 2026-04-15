# Phase 0 Research - Gestion de Departamentos Relacionados con Empleados

## 1) Generacion de clave de departamento

- Decision: Generar `clave` de departamento de forma automatica por secuencia en formato `D` + numero (`D1`, `D2`, ...).
- Rationale: Cumple la aclaracion de negocio, evita colisiones por entrada manual y mantiene consistencia con el patron de claves de empleados.
- Alternatives considered:
  - Clave manual administrada por cliente: aumenta errores de captura y conflictos de unicidad.
  - UUID: robusto pero menos legible para casos administrativos del alcance.

## 2) Representacion de empleados en respuesta de departamento

- Decision: Exponer solo lista de `claves` de empleados en `DepartamentoResponse`.
- Rationale: Evita recursividad JSON entre entidades relacionadas, simplifica payload y reduce acoplamiento de contrato.
- Alternatives considered:
  - Incluir empleado completo embebido: mayor peso de respuesta y riesgo de ciclos de serializacion.
  - Exponer lista en endpoint separado unicamente: no cumple literalmente la necesidad de "lista de empleados" en la entidad retornada.

## 3) Estrategia de integridad al eliminar departamentos

- Decision: Rechazar eliminacion de departamento cuando existan empleados asociados (sin cascada).
- Rationale: Protege integridad referencial y coincide con requisitos funcionales y asunciones del spec.
- Alternatives considered:
  - Borrado en cascada de empleados: riesgo de perdida de datos no solicitada.
  - Desasociacion automatica (null): rompe requisito de asociacion obligatoria en empleado.

## 4) Patron de relacion y mapeo JPA

- Decision: Modelar `Departamento (1) -> (N) Empleado` con `@OneToMany(mappedBy)` y `@ManyToOne` obligatorio en empleado mediante FK `departamento_clave`.
- Rationale: Es el patron natural del dominio y permite consultas/paginacion sin romper CRUD actual.
- Alternatives considered:
  - Tabla intermedia many-to-many: complejidad innecesaria para una relacion jerarquica.
  - Campo de texto sin FK: no garantiza integridad de datos.

## 5) Actualizacion de contratos y versionado

- Decision: Mantener endpoints versionados bajo `/api/v1` e incorporar nuevos recursos `/departamentos` junto con ajustes en `/empleados` para `departamentoClave`.
- Rationale: Cumple constitucion v1.1.0 de versionado explicito y minimiza cambios incompatibles.
- Alternatives considered:
  - Nueva version `/api/v2`: innecesaria para cambios compatibles controlados en esta etapa.
  - Endpoints no versionados: incumple gate constitucional.

## 6) Objetivos operativos y alcance

- Decision: Mantener objetivo p95 < 2s y alcance local/QA con 10,000 empleados, 500 departamentos y 50 req/min.
- Rationale: Reutiliza baseline validado de la feature anterior y mantiene viabilidad para entorno academico.
- Alternatives considered:
  - Objetivos mas agresivos (<500ms): no justificados para alcance actual.
  - Sin metas de desempeno: dificulta validacion objetiva en plan y tareas.
