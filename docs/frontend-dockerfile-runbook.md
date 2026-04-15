# Frontend Dockerfile Runbook

## Objective
Provide a reproducible process to build, run, validate, and stop the stack with Nginx as the single public gateway.

## Build
```bash
docker build -f frontend/Dockerfile -t empleados-frontend:local frontend
```

## Run with compose (nginx gateway on 80)
```bash
FRONTEND_API_BASE_URL=/api docker compose -f docker/compose.yml up -d --build
```

## Validate startup and routing
```bash
docker compose -f docker/compose.yml ps
curl -i http://localhost:80/
curl -i http://localhost:80/api/v1/empleados
```

Expected behavior:
- Nginx is the only host-exposed service.
- Frontend is served from `/`.
- API is routed through `/api/*` to backend `app:8080`.

## Validation Checklist
- UI loads from Nginx public host port.
- Authenticated read flow succeeds against `/api/v1/*` through proxy.
- Unauthenticated access to protected endpoints keeps expected Basic Auth rejection.
- OpenAPI remains available through proxy path.

## Daily Operation Checklist
- Start stack with `docker compose -f docker/compose.yml up -d --build`.
- Confirm only `nginx` is host-exposed in `docker compose -f docker/compose.yml ps`.
- Validate `http://localhost:80/` and `http://localhost:80/api/v1/empleados`.
- Stop stack with `docker compose -f docker/compose.yml down`.

## Verify degraded mode (backend down)
```bash
docker compose -f docker/compose.yml stop app
curl -i http://localhost:80/
curl -i http://localhost:80/api/v1/empleados
docker compose -f docker/compose.yml start app
```

Expected behavior:
- `/` remains available.
- `/api/*` returns standard proxy error (HTTP 502/504) without custom error page.

## Evidence: Frontend build and versioned API compatibility

```bash
docker build -f frontend/Dockerfile -t empleados-frontend:local frontend
curl -i http://localhost:80/api/v1/empleados
```

Expected behavior:
- Frontend build completes successfully.
- Versioned API route `/api/v1/*` remains reachable through proxy.

Evidence record:
- Build status: ________
- API status code observed: ________

## Evidence: SC-004 startup time measurement

Run 3 consecutive measurements from clean stack (down -> up -> first successful `/`).

```bash
docker compose -f docker/compose.yml down
docker compose -f docker/compose.yml up -d --build
curl -i http://localhost:80/
```

Record:
- Run 1: ________
- Run 2: ________
- Run 3: ________

Acceptance:
- All runs must be <= 5 minutes.

Evidence record:
- Run 1: ________
- Run 2: ________
- Run 3: ________
- SC-004 met: SI/NO

## Stop
```bash
docker compose -f docker/compose.yml down
```

## Troubleshooting
- Port conflict: adjust host mapping in `docker/compose.yml`.
- API unavailable: verify backend status and service health in `docker compose ps`.
- Proxy misrouting: verify `/api/` block in `frontend/nginx/default.conf.template` points to `http://app:8080`.
- Unexpected auth behavior: validate backend Basic Auth config and forwarded headers.

## Migration Note
- Legacy path `frontend/docker/` was removed.
- Runtime assets now live in `frontend/nginx/` and are copied from `frontend/Dockerfile`.
- Gateway naming in compose is standardized as service `nginx`.
