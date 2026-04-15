# Research: Frontend Docker Compose Integration

## Decision 1: Frontend container runtime model
- Decision: Build Angular artifacts in a multi-stage Dockerfile and serve static files with Nginx.
- Rationale: Aligns with clarification outcomes, yields deterministic startup, and avoids runtime Node.js dev-server overhead in compose.
- Alternatives considered:
  - Angular dev server in container: better HMR, but less production-like and less stable for reproducible team startup.
  - SSR Node runtime container: adds complexity and is outside current feature scope.

## Decision 2: API base URL configuration strategy
- Decision: Inject API base URL at container startup (runtime), not at Angular compile-time.
- Rationale: Single reusable frontend image across environments; avoids rebuild-per-environment.
- Alternatives considered:
  - Build-time environment replacement: simple but forces distinct images for each endpoint context.
  - Hardcoded compose URL in source: brittle and violates portability.

## Decision 3: Compose startup coordination
- Decision: Add backend healthcheck and gate frontend startup on backend healthy state.
- Rationale: Reduces transient API failures at initial UI load and aligns with clarified startup behavior.
- Alternatives considered:
  - Parallel startup without gating: more race conditions.
  - Manual frontend restart: poor UX and onboarding friction.

## Decision 4: Port exposure policy
- Decision: Expose only frontend to host by default; keep backend and PostgreSQL internal to compose network.
- Rationale: Smaller attack surface, fewer host port collisions, and explicit service boundary for local usage.
- Alternatives considered:
  - Expose backend and DB to host: easier ad-hoc debugging but weaker defaults.
  - Expose all services: highest convenience, lowest safety.

## Decision 5: Temporary backend unavailability handling
- Decision: UI must show clear backend-unavailable status and perform controlled automatic retries with short backoff.
- Rationale: Preserves usability during brief backend recovery windows and prevents unnecessary full stack restarts.
- Alternatives considered:
  - Static error only: high manual intervention.
  - Blocking UI without feedback: poor user experience and low diagnosability.

## Decision 6: Health endpoint strategy for compose checks
- Decision: Use a stable backend health probe endpoint suitable for container healthcheck commands, preferring an explicit health endpoint over ad-hoc TCP checks.
- Rationale: Reliable readiness signal is required for `depends_on: condition: service_healthy` semantics.
- Alternatives considered:
  - Raw TCP port-open check: service may accept connections before app readiness.
  - API business endpoint probe: may require auth/business state and create false negatives.

## Decision 7: API contract/versioning impact
- Decision: Keep existing `/api/v1/*` contract and OpenAPI scope unchanged; this feature adds an orchestration contract, not business endpoint changes.
- Rationale: Feature is packaging/orchestration only.
- Alternatives considered:
  - Introduce proxy path remapping in frontend route layer: unnecessary complexity and risk.
