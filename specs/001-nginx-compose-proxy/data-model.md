# Data Model: Nginx Compose Proxy Integration

## Entity: NginxGatewayService
- Description: Public ingress service for the local compose stack.
- Fields:
  - serviceName: string (`nginx`)
  - hostPort: integer (documented public port)
  - containerPort: integer (`80`)
  - frontendRootPath: string (`/`)
  - apiProxyBasePath: string (`/api`)
  - publicByDefault: boolean (`true`)
- Validation rules:
  - Must be the only host-published service by default.
  - Must serve frontend and forward API traffic in the same runtime.

## Entity: ProxyRouteRule
- Description: Mapping rule between incoming public route and internal upstream destination.
- Fields:
  - publicPathPrefix: string (e.g., `/api/`)
  - upstreamServiceName: string (`app`)
  - upstreamPort: integer (`8080`)
  - versionPathPreserved: boolean (`true` for `/api/v1/*`)
  - authHeadersForwarded: boolean (`true`)
- Validation rules:
  - Request path semantics for `/api/v1/*` must remain intact.
  - Proxy behavior must not bypass backend auth controls.

## Entity: InternalServiceExposurePolicy
- Description: Default host exposure policy for backend and database.
- Fields:
  - backendHostPublished: boolean (`false`)
  - databaseHostPublished: boolean (`false`)
  - internalNetworkRequired: boolean (`true`)
- Validation rules:
  - Backend and DB must remain reachable only through compose network by default.

## Entity: RuntimeFailureBehavior
- Description: Expected behavior when backend is temporarily unavailable.
- Fields:
  - frontendAvailabilityWhenBackendDown: boolean (`true`)
  - apiFailureMode: enum (`controlled-proxy-error`)
  - troubleshootingHintDocumented: boolean (`true`)
- Validation rules:
  - Frontend route `/` remains available during backend outage.
  - API route failures are explicit and diagnosable.

## Entity: ProxyRunbook
- Description: Operational guide for startup, verification, and shutdown.
- Fields:
  - startupCommand: string (`docker compose -f docker/compose.yml up -d --build`)
  - verificationSteps: list
  - shutdownCommand: string (`docker compose -f docker/compose.yml down`)
  - troubleshootingSection: list
- Validation rules:
  - Runbook must be executable by a new team member without direct support.

## State Transitions

### NginxGatewayService
- `created` -> `running` when container starts and frontend route responds.
- `running` -> `degraded` when upstream backend is unavailable for `/api/*`.
- `degraded` -> `running` when backend recovers and proxied API succeeds.

### ProxyRouteRule
- `configured` -> `active` when upstream service resolves and returns responses.
- `active` -> `error-state` when upstream is unreachable or misconfigured.
- `error-state` -> `active` after configuration or upstream recovery.
