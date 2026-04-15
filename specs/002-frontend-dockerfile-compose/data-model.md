# Data Model: Frontend Dockerfile Compose Integration

## Entity: ComposeStackDefinition
- Description: Canonical docker compose definition that orchestrates frontend, backend, and database.
- Fields:
  - composeFilePath: string (`docker/compose.yml`)
  - startupCommand: string (`docker compose -f docker/compose.yml up -d --build`)
  - networkMode: enum (`compose-default-network`)
  - hostExposurePolicy: enum (`frontend-only`)
- Validation rules:
  - Must define all required services (`frontend`, `app`, `postgres`).
  - Must keep backend and database internal by default.

## Entity: FrontendComposeService
- Description: Frontend runtime service in compose backed by Dockerfile and Nginx static serving.
- Fields:
  - serviceName: string (`frontend`)
  - buildContext: string (`frontend/`)
  - dockerfilePath: string (`frontend/Dockerfile`)
  - runtimeMode: enum (`nginx-static`)
  - hostPort: integer (`4200` default)
  - containerPort: integer (`80`)
  - apiBaseUrlDefault: string (`http://app:8080`)
  - backendHealthDependency: boolean (`true`)
- Validation rules:
  - Service must not rely on host loopback for backend communication.
  - Runtime API config must be injectable without rebuilding backend.

## Entity: BackendComposeService
- Description: Spring Boot API service consumed by frontend via internal compose DNS.
- Fields:
  - serviceName: string (`app`)
  - containerPort: integer (`8080`)
  - healthcheckEnabled: boolean
  - healthState: enum (`starting`, `healthy`, `unhealthy`)
  - apiBasePath: string (`/api/v1`)
- Validation rules:
  - Healthcheck must be deterministic and usable by compose startup dependencies.
  - API versioning path must remain explicit.

## Entity: DatabaseComposeService
- Description: PostgreSQL persistence service for backend runtime.
- Fields:
  - serviceName: string (`postgres`)
  - image: string (`postgres:16`)
  - containerPort: integer (`5432`)
  - persistentVolume: string (`pgdata`)
  - hostPortExposedByDefault: boolean (`false` target state)
- Validation rules:
  - Must be reachable by backend through internal compose network.
  - Data volume must remain persistent across stack restarts.

## Entity: RuntimeAccessConfiguration
- Description: Runtime-level endpoints and environment values required for end-to-end operation.
- Fields:
  - frontendPublicUrl: string (`http://localhost:4200`)
  - frontendApiBaseUrl: string (`http://app:8080` default in compose)
  - backendServiceDns: string (`app`)
  - credentialsReference: string (`admin/admin123` baseline or documented equivalent)
- Validation rules:
  - Frontend URL must be documented and reachable after successful startup.
  - API base URL must resolve over compose network from frontend container.

## State Transitions

### BackendComposeService.healthState
- `starting` -> `healthy` when healthcheck passes.
- `starting` -> `unhealthy` when retries/timeouts exceed threshold.
- `unhealthy` -> `healthy` after successful recovery and probe pass.

### FrontendComposeService.runtimeState
- `created` -> `running` when Nginx serves built artifacts and port binding is active.
- `running` -> `degraded` when API requests fail despite container uptime.
- `degraded` -> `running` after backend recovers and frontend requests succeed.
- `running` -> `stopped` on compose shutdown.
