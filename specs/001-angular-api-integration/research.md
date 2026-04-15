# Phase 0 Research - Front Angular Consume API REST

## 1) Estrategia de autenticacion en frontend

- Decision: Usar HTTP Basic Auth con credenciales en sesion activa (memoria/scope de sesion), sin persistencia tras cerrar pestana o navegador.
- Rationale: Reduce exposicion de credenciales y cumple clarificacion de seguridad definida.
- Alternatives considered:
  - Persistir en localStorage: mayor riesgo de fuga por XSS y sesiones demasiado largas.
  - Solicitar credenciales en cada accion: degrada UX y aumenta errores operativos.

## 2) Configuracion de base URL por entorno

- Decision: Definir base URL del API en `src/environments/*.ts` (dev/qa/prod) con fallback local para desarrollo.
- Rationale: Mantiene despliegues limpios por entorno sin cambios de codigo fuente.
- Alternatives considered:
  - URL hardcodeada: poco mantenible y fragil para cambios de entorno.
  - Configuracion runtime externa: util para despliegues avanzados pero innecesaria en alcance inicial.

## 3) Politica de reintentos

- Decision: Reintentos automaticos solo para GET idempotentes con backoff corto; sin reintentos automaticos para POST/PUT/DELETE/PATCH.
- Rationale: Mejora resiliencia de lectura evitando duplicidad en operaciones de escritura.
- Alternatives considered:
  - Reintentar todo: riesgo de efectos secundarios y cambios duplicados.
  - Sin reintentos: peor experiencia ante fallas transitorias de red.

## 4) Organizacion de frontend Angular

- Decision: Estructura por dominios (`auth`, `empleados`, `departamentos`) + `core` para servicios HTTP/interceptores.
- Rationale: Facilita escalabilidad y separacion de responsabilidades.
- Alternatives considered:
  - Estructura plana por tipo de archivo: dificulta mantenimiento a mediano plazo.
  - Monomodulo unico: reduce claridad y aislamiento funcional.

## 5) Manejo de errores y estados UI

- Decision: Estandarizar estados `loading/success/error/empty` y mapear respuestas del backend a mensajes accionables.
- Rationale: Consistencia visual y funcional para todos los flujos CRUD.
- Alternatives considered:
  - Mensajes tecnicos crudos del backend: mala experiencia para usuario final.
  - Manejo ad-hoc por pantalla: genera inconsistencias entre modulos.

## 6) Contrato de integracion UI-API

- Decision: Definir contrato de consumo frontend centrado en endpoints existentes `/api/v1/empleados` y `/api/v1/departamentos`, incluyendo codigos esperados de error/autorizacion.
- Rationale: Alinea implementacion frontend con comportamiento backend y minimiza discrepancias.
- Alternatives considered:
  - Contrato implcito solo por codigo: aumenta riesgo de desalineacion.
  - Crear endpoints nuevos para frontend: fuera de alcance de esta feature.