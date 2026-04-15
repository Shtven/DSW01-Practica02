# Implementation Evidence: 001-frontend-dockerfile-build

## Setup and Foundational
- [X] Baseline review completed
- [X] Runtime env examples aligned
- [X] New nginx path introduced (`frontend/nginx`)
- [X] Compose runtime contract aligned

## US1 Evidence
- Build command:
  - `docker build -f frontend/Dockerfile -t empleados-frontend:local frontend`
- Result:
  - SUCCESS (build completed and copied nginx assets from `frontend/nginx/*`)

## US2 Evidence
- Run with config:
  - `docker run --rm -p 4200:80 -e API_BASE_URL=http://localhost:8080 empleados-frontend:local`
- Run missing config:
  - `docker run --rm -p 4200:80 empleados-frontend:local`
- Result:
  - SUCCESS with config: container reached running state and generated `runtime-config.json` containing `apiBaseUrl`.
  - SUCCESS without config: startup failed fast with message `ERROR: API_BASE_URL is required for container startup.`
- Fail-fast wall-clock (target <=30s):
  - Measured: `0.8s` (PASS)

## US3 Evidence
- Docs updated to remove `frontend/docker` references
- Result:
  - Updated `frontend/README.md` and `docs/frontend-dockerfile-runbook.md` to runtime static nginx flow.
  - Added migration note indicating legacy folder removal and new `frontend/nginx/` path.

## Cross-cutting Validation
- Compose config validation:
  - PASS using `FRONTEND_API_BASE_URL=http://app:8080 docker compose -f docker/compose.yml config`
- No-regression checks (Basic Auth, `/api/v1/*`, Swagger/OpenAPI):
  - Frontend accessibility: `FRONTEND_STATUS=200` on `http://localhost:4200`
  - API versioning: `API_V1_PRESENT` confirmed in `/v3/api-docs`
  - Auth guard: unauthenticated call to `/api/v1/empleados` returns `HTTP/1.1 401`
  - Auth positive flow: `HTTP 200` confirmed with bootstrap credentials (`admin@example.com` / `admin123`) using compose network call to `http://app:8080/api/v1/empleados?page=0&size=1`.
- Removed path sweep (`frontend/docker` references):
  - No operational file references remain; only intentional migration note mention in runbook.

## Completion Summary
- Feature implementation completed across setup, foundational, US1, US2, US3, and polish tasks.
- Legacy folder removed from source tree and runtime assets relocated to `frontend/nginx/`.
- No residual blocking risks identified for this feature scope.
