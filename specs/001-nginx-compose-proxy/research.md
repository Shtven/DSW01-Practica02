# Research: Nginx Compose Proxy Integration

## Decision 1: Single public gateway through Nginx
- Decision: Expose only Nginx to host and keep backend/postgres internal by default.
- Rationale: Reduces attack surface, aligns with requested topology, and simplifies local access through one stable entry point.
- Alternatives considered:
  - Expose backend too: useful for debugging but breaks default internal-only policy.
  - Expose all services: increases collision risk and weakens safe defaults.

## Decision 2: Routing shape
- Decision: Serve frontend on `/` and proxy API on `/api/*`, preserving backend `/api/v1/*` paths.
- Rationale: Keeps frontend UX simple while maintaining explicit API versioning contract.
- Alternatives considered:
  - Frontend under `/app`: adds unnecessary path complexity.
  - Separate hosts/subdomains: out of scope for local compose baseline.

## Decision 3: Upstream service discovery
- Decision: Route proxy traffic to backend via compose DNS service name (`app:8080`).
- Rationale: Compose-internal DNS is deterministic and avoids host loopback pitfalls inside containers.
- Alternatives considered:
  - `localhost`: invalid from Nginx container context.
  - Static host IP: fragile across machines.

## Decision 4: Backend temporary unavailability behavior
- Decision: Keep frontend static content available and return controlled proxy error for `/api/*` while backend is down.
- Rationale: Users can still load UI and receive explicit API failure signals without masking incidents.
- Alternatives considered:
  - Global maintenance page: hides available frontend and blurs root cause.
  - Aggressive retries in proxy: may increase latency and operational ambiguity.

## Decision 5: Startup coordination
- Decision: Keep backend health-based dependency for frontend runtime path where applicable and validate stack readiness with compose checks.
- Rationale: Reduces race conditions where proxy receives API traffic before backend readiness.
- Alternatives considered:
  - No dependency/health gate: simpler but less stable startup.
  - Fixed startup sleeps: non-deterministic and environment-sensitive.

## Decision 6: Non-regression policy
- Decision: Treat auth behavior, OpenAPI availability, and `/api/v1/*` as mandatory non-regression checks in this feature.
- Rationale: Feature scope is ingress/proxy integration, not backend contract redesign.
- Alternatives considered:
  - Allow incidental backend behavior changes: increases risk and violates scope boundaries.
