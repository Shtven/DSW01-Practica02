# Phase 0 Research - Autenticacion por Correo de Empleado

## 1) Identificador de login por correo

- Decision: Reemplazar autenticacion por `nombre` con autenticacion por `correo` (comparacion case-insensitive con normalizacion a minusculas y trim).
- Rationale: El correo es un identificador mas estable y adecuado para autenticacion que el nombre de negocio.
- Alternatives considered:
  - Mantener login por `nombre`: no cumple el requerimiento principal de la feature.
  - Soportar dual login (`nombre` y `correo`): aumenta complejidad y ambiguedad sin valor en alcance actual.

## 2) Migracion de empleados legacy sin correo

- Decision: Backfill determinista en migracion con formato `<clave>@local.invalid` para empleados sin correo.
- Rationale: Permite continuidad operativa sin carga manual previa y evita valores nulos en columna de login.
- Alternatives considered:
  - Falla de despliegue hasta carga manual: alto riesgo operativo y friccion de despliegue.
  - Permitir `correo` nulo temporal: complica reglas de autenticacion y rompe consistencia del modelo.

## 3) Politica sobre correo temporal

- Decision: Bloquear autenticacion para correos temporales `@local.invalid` hasta reemplazo por correo real.
- Rationale: Evita acceso con identidades no verificadas y fuerza cierre de migracion funcional.
- Alternatives considered:
  - Permitir login temporal: incrementa superficie de riesgo y dilata regularizacion.
  - Ventana temporal de gracia: agrega reloj de negocio adicional fuera de alcance.

## 4) Autorizacion de reemplazo de correo temporal

- Decision: Solo administrador autenticado puede reemplazar correo temporal por correo real.
- Rationale: Centraliza control y reduce abuso sobre cuentas en estado transitorio.
- Alternatives considered:
  - Autoservicio por empleado: requiere segundo factor o flujo adicional no definido.
  - Actualizacion masiva por archivo externo: agrega dependencia operativa no requerida.

## 5) Prevencion de lockout inicial

- Decision: Mantener cuenta admin bootstrap autenticable con correo real fijo configurable por entorno.
- Rationale: Garantiza acceso administrativo inicial cuando cuentas legacy tienen correo temporal bloqueado.
- Alternatives considered:
  - Sin bootstrap: riesgo de lockout en primer arranque.
  - Endpoint de emergencia sin auth: debilita postura de seguridad.

## 6) Persistencia y restricciones de datos

- Decision: Agregar columna `correo` en `empleados`, indice unico case-insensitive sobre `lower(correo)` y validacion de formato en API.
- Rationale: Garantiza unicidad semantica y consistencia entre capa API y base de datos.
- Alternatives considered:
  - Unicidad case-sensitive: permitiria duplicados logicos.
  - Validar solo en API sin constraint DB: deja hueco ante escrituras fuera de API.

## 7) Contrato API y versionado

- Decision: Mantener rutas `/api/v1` y actualizar OpenAPI para incluir `correo` en alta/actualizacion/respuesta de empleado y reglas de autenticacion.
- Rationale: Cumple gobernanza constitucional de versionado y minimiza ruptura de clientes.
- Alternatives considered:
  - Crear `/api/v2` inmediato: desproporcionado para cambio compatible de payload en alcance controlado.
  - No actualizar contrato: incumple gate constitucional de API.
