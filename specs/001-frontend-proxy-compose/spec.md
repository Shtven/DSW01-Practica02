# Feature Specification: Exposicion Frontend por Proxy

**Feature Branch**: `001-frontend-proxy-compose`  
**Created**: 2026-04-15  
**Status**: Draft  
**Input**: User description: "anade un proxy a el docker compose que solo exponga el frontend mediante el puerto 80"

## Clarifications

### Session 2026-04-15

- Q: Cual debe ser la politica de exposicion de servicios internos en Docker Compose? -> A: Backend y demas servicios solo accesibles en red interna de Docker (sin puertos publicados al host).
- Q: Como debe responder el proxy cuando el upstream backend no esta disponible en rutas `/api/*`? -> A: Devolver error HTTP estandar del proxy (por ejemplo 502/504) sin pagina personalizada.
- Q: El alcance incluye HTTPS/TLS en el proxy? -> A: Alcance solo HTTP en puerto 80 (sin terminacion TLS/HTTPS en el proxy).

## Constitutional Compliance Check

- Verificacion explicita de cumplimiento constitucional completada antes de implementacion.
- Verificacion explicita de cumplimiento constitucional requerida antes de merge.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceso publico controlado al frontend (Priority: P1)

Como usuario final, quiero abrir la aplicacion desde un unico puerto publico para acceder al frontend sin exponer directamente servicios internos.

**Why this priority**: Es el objetivo principal del feature y reduce riesgo operativo al limitar la superficie expuesta.

**Independent Test**: Puede validarse levantando el entorno y comprobando que la aplicacion frontend responde por el puerto 80 mientras los servicios internos no son accesibles desde el host.

**Acceptance Scenarios**:

1. **Given** el entorno esta desplegado, **When** el usuario accede a `http://localhost:80`, **Then** visualiza el frontend correctamente.
2. **Given** el entorno esta desplegado, **When** se intenta acceder desde el host a puertos de servicios internos, **Then** la conexion es rechazada o no existe ruta publica.

---

### User Story 2 - Flujo funcional sin cambios para usuarios (Priority: P2)

Como usuario final, quiero que la navegacion y uso del frontend sigan funcionando igual a traves del proxy para no perder funcionalidades existentes.

**Why this priority**: Evita regresiones funcionales y asegura continuidad del uso de la aplicacion.

**Independent Test**: Puede validarse ejecutando un conjunto de flujos funcionales clave del frontend usando la entrada por puerto 80.

**Acceptance Scenarios**:

1. **Given** el frontend esta disponible por el proxy, **When** el usuario ejecuta un flujo funcional principal, **Then** el flujo se completa sin errores visibles.

---

### User Story 3 - Experiencia local simple para el equipo (Priority: P3)

Como miembro del equipo, quiero iniciar el entorno con una unica entrada publica para simplificar pruebas y demostraciones locales.

**Why this priority**: Mejora la usabilidad del entorno de desarrollo, aunque es secundario frente al control de exposicion.

**Independent Test**: Puede validarse iniciando el entorno desde cero y comprobando que la guia de uso del acceso publico es clara y suficiente.

**Acceptance Scenarios**:

1. **Given** un entorno limpio, **When** un miembro del equipo inicia la solucion, **Then** identifica un unico endpoint publico para consumir el frontend.

### Edge Cases

- Que ocurre si el servicio frontend interno no esta disponible al iniciar el entorno.
- Como responde el sistema cuando el puerto 80 ya esta en uso en la maquina host.
- Que sucede si un usuario intenta acceder por rutas directas a servicios no destinados a exposicion publica.
- Como se comporta el acceso al frontend cuando hay reinicio del proxy y peticiones concurrentes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST publicar un unico punto de entrada HTTP por el puerto 80 para consumo del frontend.
- **FR-002**: El sistema MUST enrutar el trafico entrante del puerto 80 hacia el frontend sin requerir puertos publicos adicionales para el usuario final.
- **FR-003**: El sistema MUST evitar la exposicion publica directa de servicios internos (incluyendo backend y auxiliares), manteniendolos accesibles solo dentro de la red interna de Docker, sin publicacion de puertos al host.
- **FR-004**: El sistema MUST mantener el comportamiento funcional existente del frontend cuando el acceso se realiza a traves del proxy.
- **FR-005**: El sistema MUST permitir iniciar y detener el entorno completo mediante la orquestacion definida en Docker Compose sin pasos manuales especiales para habilitar el proxy.
- **FR-006**: El sistema MUST devolver un error HTTP estandar del proxy (por ejemplo 502 o 504) para solicitudes en rutas `/api/*` cuando el upstream backend no pueda ser servido por el punto de entrada publico.
- **FR-007**: El sistema MUST limitar el alcance de esta funcionalidad a HTTP por puerto 80, sin requerir configuracion ni exposicion de HTTPS/TLS.

### Assumptions

- El entorno objetivo principal es uso local para desarrollo y demostracion.
- El puerto 80 esta permitido por politicas locales o puede habilitarse por el usuario.
- El frontend ya existe y su funcionamiento base es correcto antes de aplicar este feature.
- El objetivo de este feature es control de exposicion de red, no cambios de logica de negocio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las sesiones de prueba de acceso al frontend se inicia usando un unico endpoint HTTP en puerto 80.
- **SC-002**: El 100% de los intentos de acceso directo desde host a servicios internos no destinados a exposicion publica falla durante validacion.
- **Critical Flows Set**: F1 carga de pagina inicial por `/`, F2 carga de `runtime-config.json`, F3 navegacion SPA a una ruta interna, F4 llamada a `/api/v1/empleados` sin credenciales devuelve 401, F5 llamada a `/api/v1/empleados` con credenciales validas responde sin error de proxy.
- **SC-003**: Al menos el 95% de exito sobre el conjunto de flujos criticos F1-F5, medido en 20 ejecuciones controladas.
- **SC-004**: En 3 ejecuciones consecutivas desde entorno limpio, el tiempo desde `docker compose -f docker/compose.yml up -d --build` hasta obtener respuesta exitosa en `/` MUST ser menor o igual a 5 minutos.
