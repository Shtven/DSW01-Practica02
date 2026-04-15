# Data Model: Frontend Dockerfile Simplification

## Entity: FrontendImageBuildDefinition
- Description: Canonical definition of how frontend image is built from a single Dockerfile.
- Fields:
  - dockerfilePath: string (`frontend/Dockerfile`)
  - buildContextPath: string (`frontend/`)
  - outputType: enum (`static-assets-image`)
  - legacyDockerFolderAllowed: boolean (`false`)
- Validation rules:
  - Build must succeed without reading files from `frontend/docker`.
  - Dockerfile path and build context must be documented and reproducible.

## Entity: FrontendRuntimeConfiguration
- Description: Mandatory runtime inputs required for frontend container startup.
- Fields:
  - apiBaseUrl: string (required; no default)
  - startupPolicy: enum (`fail-fast-on-missing-config`)
  - startupErrorTimeoutSeconds: integer (`<=30` target)
- Validation rules:
  - Missing `apiBaseUrl` must fail startup with clear message.
  - Provided URL must be syntactically valid and reachable by compose network policy.

## Entity: ComposeExposurePolicy
- Description: Default host/internal exposure behavior for local compose services.
- Fields:
  - frontendHostPort: integer (`4200` default)
  - backendHostExposureDefault: boolean (`false`)
  - databaseHostExposureDefault: boolean (`false`)
  - internalServiceDiscovery: string (`compose-dns`)
- Validation rules:
  - Frontend remains host-accessible on `4200` by default.
  - Backend/database are not host-published unless explicitly overridden.

## Entity: CompatibilityBaseline
- Description: Non-regression contract for backend feature behavior unaffected by this change.
- Fields:
  - authBehaviorUnchanged: boolean
  - apiVersioningPath: string (`/api/v1/*`)
  - swaggerAccessibilityUnchanged: boolean
- Validation rules:
  - Authentication must keep existing functional behavior.
  - API versioning and OpenAPI docs must remain available after compose/frontend changes.

## State Transitions

### FrontendContainerState
- `configured` -> `running` when runtime config is complete and assets are served.
- `configured` -> `failed` when mandatory runtime variables are missing.
- `running` -> `stopped` on compose down.

### ComposeStackState
- `created` -> `ready` when frontend is reachable on `http://localhost:4200` and internal backend/db networking works.
- `created` -> `degraded` when frontend starts but API runtime configuration is invalid or missing.
- `ready` -> `stopped` on stack shutdown.
