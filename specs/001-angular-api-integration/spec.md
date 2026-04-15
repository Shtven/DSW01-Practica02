# Feature Specification: Front Angular Consume API REST

**Feature Branch**: `001-angular-api-integration`  
**Created**: 2026-03-24  
**Status**: Ready for Implementation  
**Input**: User description: "haz que el front de angular consuma el API rest"

## Clarifications

### Session 2026-03-24

- Q: Como gestionar la persistencia de credenciales Basic Auth en frontend? -> A: Solo sesion activa (memoria/scope de sesion); requerir re-login al cerrar pestaña o navegador.
- Q: Que modelo de roles debe aplicar el frontend en esta fase? -> A: Solo rol administrador para todas las vistas y acciones de empleados/departamentos.
- Q: Como definir la URL base del API para frontend en distintos entornos? -> A: Configuracion por entorno Angular (environment files) con fallback local.
- Q: Que politica de reintentos debe usar el frontend para errores transitorios? -> A: Reintento automatico solo para lecturas idempotentes (GET), nunca para operaciones de escritura.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Autenticar y Listar Datos (Priority: P1)

Como usuario del sistema, quiero iniciar sesion desde el frontend y consultar los listados principales para usar la aplicacion sin depender de llamadas manuales al API.

**Why this priority**: Habilita el flujo base de uso del producto y valida la integracion real frontend-backend.

**Independent Test**: Iniciar sesion con credenciales validas y abrir los listados de empleados y departamentos mostrando informacion obtenida del API.

**Acceptance Scenarios**:

1. **Given** un usuario con credenciales validas, **When** intenta acceder desde el frontend, **Then** puede navegar a vistas protegidas y consultar datos del API.
2. **Given** credenciales invalidas o ausentes, **When** intenta acceder a vistas protegidas, **Then** el frontend bloquea el acceso y muestra estado de autenticacion no autorizado.

---

### User Story 2 - Gestionar Empleados desde UI (Priority: P2)

Como usuario administrador, quiero crear, consultar, actualizar y eliminar empleados desde el frontend para operar el negocio sin herramientas externas.

**Why this priority**: Es el caso de uso principal para administracion diaria y entrega valor directo de negocio.

**Independent Test**: Completar un flujo CRUD de empleados desde la UI y validar que los cambios persisten y se reflejan al refrescar el listado.

**Acceptance Scenarios**:

1. **Given** un formulario de empleado valido, **When** el usuario guarda datos, **Then** el frontend confirma la operacion y actualiza el listado.
2. **Given** un formulario con datos invalidos o conflicto de negocio, **When** el usuario intenta guardar, **Then** el frontend muestra mensajes de error claros sin perder el contexto del formulario.

---

### User Story 3 - Gestionar Departamentos y Relacion (Priority: P3)

Como usuario administrador, quiero gestionar departamentos y su relacion con empleados desde el frontend para mantener la estructura organizacional actualizada.

**Why this priority**: Completa la cobertura funcional del dominio y evita mezclar flujos manuales fuera de la aplicacion.

**Independent Test**: Crear departamento, asociar empleados, validar consultas y probar reglas de eliminacion con dependencias desde la UI.

**Acceptance Scenarios**:

1. **Given** un departamento sin empleados asociados, **When** el usuario lo elimina, **Then** la UI confirma eliminacion exitosa y lo retira del listado.
2. **Given** un departamento con empleados asociados, **When** el usuario intenta eliminarlo, **Then** la UI informa el bloqueo de integridad y mantiene el estado consistente.

---

### Edge Cases

- Sesion expirada durante una operacion de formulario debe redirigir a autenticacion preservando mensaje de estado.
- Respuestas lentas o timeout del API deben mostrar estado de carga y opcion de reintento sin duplicar solicitudes.
- Errores 4xx y 5xx deben presentarse con mensajes legibles para usuario, evitando detalles internos del backend.
- Listados vacios deben mostrarse con estado vacio claro y accion sugerida.
- Datos con espacios laterales deben normalizarse en campos aplicables antes de enviar solicitud.
- Doble clic en acciones de guardado/eliminacion no debe provocar ejecuciones duplicadas.
- Paginacion fuera de rango debe corregirse automaticamente a una pagina valida.
- Reintentos automaticos no deben ejecutarse sobre operaciones de escritura para evitar duplicidad de cambios.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El frontend web MUST ejecutarse en Angular 21 y consumir endpoints REST versionados del backend.
- **FR-002**: El frontend MUST aplicar autenticacion HTTP Basic para operaciones protegidas del API.
- **FR-003**: El frontend MUST permitir iniciar sesion con credencial administrativa local documentada y manejar estado autenticado/no autenticado.
- **FR-004**: El frontend MUST listar empleados y departamentos consumiendo datos reales del API.
- **FR-005**: El frontend MUST permitir crear, actualizar y eliminar empleados mediante formularios conectados al API.
- **FR-006**: El frontend MUST permitir crear, actualizar y eliminar departamentos respetando reglas de negocio vigentes del backend.
- **FR-007**: El frontend MUST reflejar mensajes de error del API de manera clara, accionable y consistente para el usuario.
- **FR-008**: El frontend MUST mostrar estados de carga, exito y error para cada operacion remota.
- **FR-009**: El frontend MUST soportar paginacion en listados principales conforme a parametros del API.
- **FR-010**: El frontend MUST preservar compatibilidad con el contrato OpenAPI vigente sin introducir rutas no versionadas.
- **FR-011**: El frontend MUST ejecutarse en entorno local reproducible junto al backend y dependencias requeridas.
- **FR-012**: El frontend MUST evitar envios duplicados por accion del usuario en operaciones de escritura.
- **FR-013**: El frontend MUST manejar credenciales Basic Auth solo en sesion activa (memoria/sesion) y MUST requerir nueva autenticacion al cerrar pestaña o navegador.
- **FR-014**: El frontend MUST operar con alcance de rol administrador unico en esta fase para todas las vistas y acciones de empleados/departamentos.
- **FR-015**: El frontend MUST resolver la URL base del API por entorno (desarrollo/QA/produccion) mediante configuracion de environments con fallback local documentado.
- **FR-016**: El frontend MUST aplicar reintentos automaticos solo sobre operaciones de lectura idempotentes (GET) y MUST excluir operaciones de escritura (POST/PUT/DELETE/PATCH).

### Assumptions

- El backend ya expone endpoints funcionales de empleados y departamentos bajo rutas `/api/v1`.
- El alcance de esta feature se centra en consumo del API desde frontend, no en rediseño de reglas de negocio del backend.
- La autenticacion mantiene esquema Basic Auth en esta etapa.
- Las credenciales de autenticacion en frontend se mantienen solo durante sesion activa y no persisten tras cerrar pestaña o navegador.
- El alcance funcional de la UI en esta fase se limita a operaciones de administrador autenticado.
- La URL base del API se administra por configuracion de entorno del frontend, con valor local por defecto para desarrollo.
- Los reintentos automaticos se limitan a operaciones de lectura idempotentes para reducir riesgo de escrituras duplicadas.
- Los mensajes de error de dominio relevantes son provistos por el backend y reutilizados por la UI.
- El despliegue inicial objetivo es entorno local con configuracion reproducible.

## Constitution Check

- **Pre-implementacion**: PASS. Esta especificacion alinea stack y restricciones obligatorias (Spring Boot 3/Java 17 backend, Angular 21 frontend, HTTP Basic Auth, PostgreSQL, rutas versionadas `/api/v1/...` y ejecucion local reproducible).
- **Pre-merge**: PASS condicional. El merge requiere evidencia registrada de validacion en quickstart, incluyendo build frontend e integracion con API versionada, conforme a tareas T045 y T047.
- **Trazabilidad**: La verificacion explicita en plan y tasks se mantiene en `specs/001-angular-api-integration/plan.md` y `specs/001-angular-api-integration/tasks.md`.

### Key Entities *(include if feature involves data)*

- **SesionUI**: Estado de autenticacion del usuario en frontend para acceso a vistas protegidas y ejecucion de operaciones API.
- **EmpleadoView**: Proyeccion de datos de empleado consumida por listados y formularios de alta/edicion.
- **DepartamentoView**: Proyeccion de datos de departamento y su relacion con empleados para listados y gestion.
- **ApiErrorView**: Representacion de errores funcionales y tecnicos para mensajes consistentes en UI.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de 30 intentos de login con credenciales validas (20 en local y 10 en QA) permite acceso a vistas protegidas desde frontend sin errores 401/403 inesperados.
- **SC-002**: El 100% de operaciones CRUD validas de empleados y departamentos iniciadas desde UI devuelve resultado consistente con el backend.
- **SC-003**: Al menos el 95% de 100 consultas GET por cada listado principal (empleados y departamentos), excluyendo 10 solicitudes de calentamiento, finaliza en menos de 2 segundos en entorno local/QA.
- **SC-004**: Al menos el 90% de errores provocados en pruebas funcionales guiadas se muestra con mensaje claro sin recargar la aplicacion.

### Measurement Protocol

- Para SC-001, registrar evidencia de los 30 intentos en quickstart con resultado por intento y entorno.
- Para SC-003, medir tiempos con una captura exportable de red (DevTools o equivalente) y calcular p95 sobre las muestras validas.
- La evidencia de SC-001..SC-004 MUST consolidarse en quickstart en una seccion de resultados finales de validacion.
