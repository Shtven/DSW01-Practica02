# Quickstart: Frontend Dockerfile Compose Integration

## Goal
Levantar frontend, backend y PostgreSQL con un solo comando usando Docker Compose, con frontend servido por Nginx desde build estatico y conectividad API por DNS interno (`app`).

## Prerequisites
- Docker Desktop (o Docker Engine + compose plugin) en ejecucion.
- Puerto `4200` libre en host.
- Variables de entorno base para backend disponibles (o defaults del compose).

## 1) Build and start stack
Desde la raiz del repositorio:

```bash
docker compose -f docker/compose.yml up -d --build
```

## 2) Validate service status

```bash
docker compose -f docker/compose.yml ps
```

Expected baseline:
- `postgres` running
- `app` running and healthy
- `frontend` running

## 3) Access frontend
- Abrir: `http://localhost:4200`
- Confirmar que la UI carga correctamente.

## 4) Validate functional flow
1. Iniciar sesion con credencial local baseline (`admin/admin123`) o equivalente documentado.
2. Ejecutar al menos una lectura autenticada.
3. Ejecutar al menos una escritura autenticada.
4. Verificar que rutas consumidas sigan bajo `/api/v1/*`.

## 5) Validate network/exposure policy
- Frontend publicado en host por defecto: `4200`.
- Backend y PostgreSQL deben permanecer internos por defecto en compose.

## 6) Stop stack

```bash
docker compose -f docker/compose.yml down
```

## Optional cleanup (including volume)

```bash
docker compose -f docker/compose.yml down -v
```

## Troubleshooting
- Frontend no inicia por puerto ocupado:
  - Cambiar mapeo de puerto frontend en compose y actualizar documentacion local.
- Frontend inicia pero sin datos:
  - Confirmar que `API_BASE_URL` resuelve a `http://app:8080` en runtime de frontend.
- Backend no saludable:
  - Revisar logs: `docker compose -f docker/compose.yml logs app`
  - Confirmar conectividad app->postgres y variables DB.
- Error de autenticacion:
  - Verificar credencial local baseline/equivalente y estado del backend.

## Evidence Log Template

### SC-001 One-command startup reliability
- Run count target: 10
- Result: Pending

### SC-002 Functional usable initial load
- Sample target: 20 initial loads
- Result: Pending

### SC-003 Startup time under 60s
- Sample target: 20 startups
- Result: Pending

### SC-004 Onboarding reproducibility
- Team members target: >=2
- Result: Pending
