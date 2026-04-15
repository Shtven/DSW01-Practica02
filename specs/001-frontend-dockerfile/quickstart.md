# Quickstart: Frontend Dockerfile Startup

## Goal
Construir y ejecutar el frontend Angular en contenedor usando `ng serve`, con `API_BASE_URL` obligatoria y puerto configurable (default `4200`).

## Prerequisites
- Docker Desktop (o Docker Engine) instalado y en ejecucion.
- API backend disponible y alcanzable desde el host.
- Variable `API_BASE_URL` definida para el entorno de ejecucion.

## 1) Build frontend image
Desde la raiz del repositorio:

```bash
docker build -f frontend/Dockerfile -t empleados-frontend:local frontend
```

## 2) Run frontend container
Ejemplo con puerto por defecto:

```bash
docker run --rm -p 4200:4200 -e API_BASE_URL=http://localhost:8080 --restart on-failure:3 --name empleados-frontend empleados-frontend:local
```

Ejemplo con puerto configurable:

```bash
docker run --rm -p 4300:4300 -e FRONTEND_PORT=4300 -e API_BASE_URL=http://localhost:8080 --restart on-failure:3 --name empleados-frontend empleados-frontend:local
```

## 3) Verify application access
- Abrir la UI en `http://localhost:4200` (o puerto configurado).
- Verificar flujo de login.
- Verificar al menos una lectura autenticada de datos desde API versionada `/api/v1/*`.

## 4) Failure behavior checks
- Omitir `API_BASE_URL` y confirmar que el contenedor falla de forma inmediata con error claro.
- Mensaje esperado de fail-fast: `ERROR: API_BASE_URL is required for container startup.`
- Simular falla transitoria y confirmar politica de reinicio acotada (`on-failure:3`) sin loops infinitos.

## 5) Stop container
```bash
docker stop empleados-frontend
```

## 6) Startup/shutdown reproducibility checklist
- [ ] Build image from clean workspace.
- [ ] Run container with required environment variables.
- [ ] Confirm UI is reachable in published host port.
- [ ] Stop container and verify clean shutdown.

## 7) Optional compose boundary (acceptance scope)
- This feature does not require changes to `docker/compose.yml`.
- If compose integration is used, treat it as optional extension and validate that Dockerfile-only flow still works independently.
- Acceptance note: Dockerfile-only build and runtime flow validated without requiring compose changes.

## Troubleshooting
- Puerto ocupado:
  - Cambiar `FRONTEND_PORT` y mapear `-p <host>:<container>` al mismo valor.
- Error por variable faltante:
  - Definir `API_BASE_URL` antes de iniciar el contenedor.
- UI sin datos:
  - Verificar conectividad al backend y credenciales Basic Auth en el flujo de aplicacion.
- Reinicio en bucle:
  - Confirmar que la politica se mantenga en `on-failure:3` y revisar causa raiz en logs.

## Evidence Log (SC)

### SC-001 Build Reliability (10/10)
- Pending execution.
- Baseline evidence: `docker build -f frontend/Dockerfile -t empleados-frontend:local frontend` succeeded (1/10).

### SC-002 Startup Time (20 runs, <60s)
- Pending execution.
- Baseline evidence: container reached `Up` state and served Angular dev server in one measured run.

### SC-003 Functional Flow (login + authenticated read)
- Pending execution.

### SC-004 Onboarding Reproducibility (>=2 members)
- Pending execution.

### Non-Regression Checks
- Basic Auth baseline compatibility: Pending execution.
- Swagger/OpenAPI accessibility: Pending execution.
- Backend baseline (Spring Boot 3.x, Java 17): Pending execution.
- PostgreSQL persistence baseline: Pending execution.

### Runtime smoke evidence
- Startup with required env succeeded:
  - `docker run -d --name empleados-frontend-test -p 4200:4200 -e API_BASE_URL=http://localhost:8080 --restart on-failure:3 empleados-frontend:local`
  - Observed status: `empleados-frontend-test|Up 20 seconds`
  - Observed app log: `Local: http://localhost:4200/`
- Fail-fast without `API_BASE_URL` succeeded:
  - `docker run --rm --name empleados-frontend-fail empleados-frontend:local`
  - Observed output: `ERROR: API_BASE_URL is required for container startup.`
  - Exit code: `1`
