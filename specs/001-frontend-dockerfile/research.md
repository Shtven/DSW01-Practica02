# Research: Frontend Dockerfile Startup

## Decision 1: Frontend runtime mode
- Decision: Run frontend container using `ng serve`.
- Rationale: Explicit clarification from user for this feature scope and fastest path for local reproducibility.
- Alternatives considered:
  - Static build + Nginx: more production-like, but not selected in clarification.
  - Dual-mode Dockerfile: increases complexity beyond requested scope.

## Decision 2: Frontend port strategy
- Decision: Use environment-configurable frontend port with default `4200`.
- Rationale: Prevents host-port conflicts while preserving familiar default behavior.
- Alternatives considered:
  - Fixed 4200 only: simpler but less flexible under conflicts.
  - Random port assignment: harder onboarding and documentation.

## Decision 3: API base URL runtime configuration
- Decision: Require `API_BASE_URL` at runtime and fail-fast if missing.
- Rationale: Avoids hidden localhost assumptions and forces explicit integration configuration.
- Alternatives considered:
  - Hardcoded URL: brittle across environments.
  - Implicit fallback to localhost: can mask misconfiguration.

## Decision 4: Restart policy
- Decision: Use bounded automatic restart policy (`on-failure` with documented retry limit).
- Rationale: Handles transient failures while avoiding infinite restart loops.
- Alternatives considered:
  - No restart: requires manual intervention for transient faults.
  - Always restart: may hide persistent configuration problems.

## Decision 5: Feature scope boundary
- Decision: Scope is frontend Dockerfile + operational docs only; `docker/compose.yml` changes are optional.
- Rationale: Matches explicit clarification and keeps delivery small and focused.
- Alternatives considered:
  - Mandatory compose integration in same feature: larger blast radius.
  - Split docs from Dockerfile: reduces usability for immediate adoption.

## Decision 6: API contract impact
- Decision: No backend endpoint changes; maintain `/api/v1/*` consumption and validate non-regression.
- Rationale: This feature is infrastructure/packaging oriented.
- Alternatives considered:
  - Introduce proxy rewrite paths: unnecessary and out of scope.
