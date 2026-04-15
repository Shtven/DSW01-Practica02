# Research: Frontend Dockerfile Simplification

## Decision 1: Remove frontend/docker physically
- Decision: Delete the `frontend/docker` folder from repository history moving forward and remove all runtime/build references to it.
- Rationale: The feature explicitly requires structural simplification and avoiding accidental dependency on legacy paths.
- Alternatives considered:
  - Keep folder but unused: leaves ambiguity and maintenance debt.
  - Deprecate folder gradually: introduces dual-path complexity not required by scope.

## Decision 2: Single frontend Dockerfile with static runtime
- Decision: Use only `frontend/Dockerfile` to build static frontend artifacts and serve them through a web server runtime image.
- Rationale: Aligns with clarified runtime model and provides deterministic, production-like behavior in local compose.
- Alternatives considered:
  - Dev server runtime (`ng serve`): less stable and not representative for container runtime.
  - Build-only image without runtime definition: does not satisfy startup and orchestration scenarios.

## Decision 3: API base URL runtime policy
- Decision: `API_BASE_URL` is mandatory at runtime with no implicit default; container must fail fast when missing.
- Rationale: Explicit configuration avoids silent misrouting and enforces environment clarity.
- Alternatives considered:
  - Default to `http://app:8080`: easier startup but conflicts with explicit user clarification.
  - Compile-time fixed API URL: reduces portability across environments.

## Decision 4: Compose exposure defaults
- Decision: Keep frontend exposed on host port `4200` by default; keep backend and database internal-only by default.
- Rationale: Preserves expected frontend access while reducing host exposure for internal services.
- Alternatives considered:
  - Expose backend/db to host by default: larger attack surface and unnecessary for baseline flow.
  - Change frontend host port: creates avoidable onboarding friction.

## Decision 5: Non-regression scope for backend/API contracts
- Decision: Preserve existing auth behavior, `/api/v1/*` versioning, and Swagger/OpenAPI accessibility unchanged.
- Rationale: Feature scope is containerization simplification, not API redesign.
- Alternatives considered:
  - Introduce API/proxy contract changes in same feature: increases risk without required business value.
  - Skip explicit non-regression checks: could hide backward compatibility issues.
