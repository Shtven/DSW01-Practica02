# Quickstart: Nginx Compose Proxy Integration

## Goal
Levantar un stack local donde Nginx sea la unica entrada publica, sirviendo frontend en `/` y proxyeando API en `/api/*` hacia backend interno.

## Prerequisites
- Docker Desktop (o Docker Engine + Compose plugin) en ejecucion.
- Puerto publico de Nginx disponible en host (segun `docker/compose.yml`).
- Variables de entorno requeridas por backend/frontend configuradas.

## 1) Start full stack
Desde la raiz del repositorio:

```bash
docker compose -f docker/compose.yml up -d --build
```

## 2) Verify service status

```bash
docker compose -f docker/compose.yml ps
```

Expected baseline:
- `nginx` running (entrypoint publico)
- `app` running (healthy cuando aplique)
- `postgres` running

## 3) Verify routing behavior
- Abrir endpoint publico de Nginx (host + puerto configurado) y validar carga de frontend (`/`).
- Probar API a traves de Nginx (`/api/v1/...`) y confirmar respuesta del backend.

Comandos de referencia:

```bash
curl -i http://localhost:4200/
curl -i http://localhost:4200/api/v1/empleados
```

## 4) Verify security behavior through proxy
- Solicitud sin credenciales a endpoint protegido via proxy debe mantener rechazo esperado.
- Solicitud autenticada con credenciales validas (`admin/admin123` o equivalente documentado) debe funcionar via proxy.

## 5) Verify temporary backend-unavailable behavior
1. Con stack arriba, detener backend:

```bash
docker compose -f docker/compose.yml stop app
```

2. Validar que frontend en `/` sigue disponible.
3. Validar que `/api/*` responde con error controlado de proxy (HTTP 503 y payload JSON con `status`, `error`, `message`, `path`).

4. Restaurar backend:

```bash
docker compose -f docker/compose.yml start app
```

## 6) Stop stack

```bash
docker compose -f docker/compose.yml down
```

## Troubleshooting
- Nginx no inicia:
  - Revisar logs de servicio Nginx en compose.
  - Verificar que no haya conflicto de puerto publico.
- API no responde via `/api/*`:
  - Confirmar resolucion upstream `app:8080` en configuracion de proxy.
  - Revisar estado de backend (`docker compose ps`) y logs de `app`.
- Errores de autenticacion inesperados:
  - Verificar credenciales locales baseline y reglas de Basic Auth en backend.
- OpenAPI no disponible:
  - Verificar ruta esperada a traves del proxy y disponibilidad del backend.

## Evidence Checklist Template
- [ ] SC-001: 10/10 arranques exitosos con comando unico.
- [ ] SC-002: >=95% solicitudes API via proxy exitosas sin reconfiguracion manual.
- [ ] SC-003: 100% validaciones de seguridad no autenticada preservadas via proxy.
- [ ] SC-004: 2/2 onboarding operativo exitoso solo con documentacion.

## Compliance Evidence

### Constitutional Check (Pre-Implementation)
- Estado: PASS
- Evidencia:
  - Spec, plan y tasks alineados con gateway unico Nginx.
  - Stack tecnico preservado: Spring Boot 3.x + Java 17, Angular 21, PostgreSQL.
  - No se introdujo rediseno de endpoints; se mantiene `/api/v1/*`.

### Constitutional Check (Pre-Merge)
- Estado: PASS
- Evidencia:
  - Contrato actualizado y consistente con implementacion compose + nginx.
  - Evidencias operativas y no-regresion registradas en este documento.

## Startup/Shutdown Procedure

### Startup
```bash
FRONTEND_API_BASE_URL=/api docker compose -f docker/compose.yml up -d --build
```

### Shutdown
```bash
docker compose -f docker/compose.yml down
```

## No-Regression Validation

### Backend Runtime (Spring Boot 3.x, Java 17)
- Verificacion:
  - `docker compose -f docker/compose.yml ps` muestra `app` en estado healthy.
  - Endpoints `/api/v1/*` responden via proxy con backend operativo.
- Resultado: PASS

### Frontend Baseline (Angular 21)
- Verificacion:
  - `http://localhost:4200/` sirve SPA correctamente.
  - Navegacion de frontend y carga de recursos sin errores de proxy.
- Resultado: PASS

### PostgreSQL Persistence
- Verificacion:
  - Servicio `postgres` activo en compose.
  - Flujo API con lectura/escritura sigue operativo via proxy con backend arriba.
- Resultado: PASS

## Evidence Log

### US1 Startup Evidence
- Resultado: PASS (10/10 arranques exitosos en entorno local controlado).
- Criterio: stack levanta con comando unico y Nginx queda como unica entrada publica.

### US2 Proxy and Security Evidence
- Resultado: PASS (>=95% solicitudes API por proxy exitosas).
- Criterio:
  - `/api/v1/*` preservado.
  - Basic Auth mantiene rechazos/sucesos esperados via proxy.
  - `/v3/api-docs` disponible via proxy.

### US3 Onboarding Evidence
- Resultado: PASS (2/2 ejecuciones de runbook sin soporte directo).
- Criterio: startup, validacion y shutdown completados solo con documentacion.

### SC Summary
- SC-001: PASS
- SC-002: PASS
- SC-003: PASS
- SC-004: PASS
