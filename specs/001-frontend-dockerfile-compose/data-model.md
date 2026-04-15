# Data Model: Frontend Docker Compose Integration

## Entity: FrontendContainerService
- Description: Compose-managed service that serves Angular build artifacts through Nginx.
- Fields:
  - name: string (`frontend`)
  - buildContext: string (repository root or `frontend/` depending on Dockerfile placement)
  - dockerfilePath: string
  - imageTag: string
  - publicPort: integer (host-exposed, default `4200` or documented alternative)
  - internalPort: integer (container Nginx port, typically `80`)
  - apiBaseUrlSource: enum (`runtime-env`)
  - dependsOnBackendHealthy: boolean
  - retryPolicyEnabled: boolean
- Validation rules:
  - publicPort must be unique on host.
  - dockerfilePath must exist and produce deployable static artifacts.
  - apiBaseUrlSource must be runtime-configurable without image rebuild.

## Entity: BackendService
- Description: Existing Spring Boot API service used by frontend through internal compose network.
- Fields:
  - name: string (`app`)
  - internalPort: integer (`8080`)
  - healthcheckCommand: string
  - healthState: enum (`starting`, `healthy`, `unhealthy`)
  - authMode: enum (`basic-auth`)
  - apiVersionBasePath: string (`/api/v1`)
- Validation rules:
  - healthcheck must be deterministic and independent from transient user data.
  - apiVersionBasePath must remain explicit and unchanged.

## Entity: DatabaseService
- Description: Existing PostgreSQL service consumed by backend.
- Fields:
  - name: string (`postgres`)
  - image: string (`postgres:16`)
  - internalPort: integer (`5432`)
  - persistedVolume: string (`pgdata`)
  - credentialSource: enum (`env-vars`)
- Validation rules:
  - service remains reachable from backend via compose DNS.
  - persistent volume binding remains intact.

## Entity: RuntimeAccessConfiguration
- Description: Runtime configuration values that connect frontend to backend and users to frontend.
- Fields:
  - frontendPublicUrl: string (e.g., `http://localhost:<frontend-port>`)
  - backendInternalUrl: string (e.g., `http://app:8080`)
  - frontendApiBaseUrlRuntimeValue: string
  - authCredentialReference: string (documented local credential policy)
- Validation rules:
  - backendInternalUrl must not depend on host loopback.
  - frontendApiBaseUrlRuntimeValue must be injectable at startup.

## Entity: StackOrchestrationDefinition
- Description: Compose-level declaration coordinating startup, networking, and service exposure.
- Fields:
  - services: set (`frontend`, `app`, `postgres`)
  - internalNetwork: string
  - startupDependencies: list (frontend -> app healthy, app -> postgres)
  - hostPortExposurePolicy: enum (`frontend-only`)
  - startupCommand: string (`docker compose up -d`)
- Validation rules:
  - hostPortExposurePolicy defaults to frontend-only.
  - startupDependencies must prevent frontend-before-backend-ready race.

## State Transitions

### Backend health state
- `starting` -> `healthy` when healthcheck passes.
- `starting` -> `unhealthy` when retries exceed threshold.
- `unhealthy` -> `healthy` after recovery and consecutive successful probes.

### Frontend runtime connectivity state
- `booting` -> `connected` when first API call succeeds.
- `booting` -> `degraded` when API is unavailable.
- `degraded` -> `connected` after automatic retry succeeds.
- `degraded` -> `error-persistent` when retry budget is exhausted.
