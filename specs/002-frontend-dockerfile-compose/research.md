# Research: Frontend Dockerfile Compose Integration

## Decision 1: Frontend runtime architecture in compose
- Decision: Use a multi-stage frontend image (Angular production build) served by Nginx.
- Rationale: Matches clarified requirement, improves startup consistency, and reduces container runtime overhead versus development server mode.
- Alternatives considered:
  - Keep `ng serve` in compose: faster for live coding but less stable and less representative for shared local stack startup.
  - Dual runtime in same compose service: adds branching complexity and onboarding ambiguity.

## Decision 2: API base URL default inside compose
- Decision: Default frontend runtime API URL to `http://app:8080`.
- Rationale: Uses compose DNS service discovery and avoids host-loopback coupling.
- Alternatives considered:
  - `http://localhost:8080`: breaks in container-to-container calls because localhost points to the frontend container.
  - No default value: increases misconfiguration risk during first startup.

## Decision 3: Service startup coordination
- Decision: Gate frontend startup on backend health (`depends_on` with `service_healthy`).
- Rationale: Reduces transient UI failures during stack boot and enforces deterministic startup order.
- Alternatives considered:
  - Parallel startup without health gate: frequent race conditions in first API calls.
  - Fixed sleep delay: non-deterministic and environment-sensitive.

## Decision 4: Host port exposure policy
- Decision: Expose only frontend on host by default; keep backend and PostgreSQL internal.
- Rationale: Smaller attack surface and fewer host-port collisions while preserving full stack functionality.
- Alternatives considered:
  - Expose backend and DB by default: easier ad-hoc debugging but weaker defaults.
  - Expose backend only: still increases host exposure without functional necessity for baseline usage.

## Decision 5: Frontend host port baseline
- Decision: Publish frontend on host port `4200` by default.
- Rationale: Aligns with existing project expectations and avoids unnecessary developer workflow changes.
- Alternatives considered:
  - Port 80/8080: can conflict with other local services and introduces migration friction.
  - Randomized host port: harder onboarding and documentation.

## Decision 6: Backend temporary unavailability behavior
- Decision: Preserve clear UI error messaging and bounded recovery behavior while compose startup gating handles initial readiness.
- Rationale: Startup stability and runtime resilience address different failure windows and both are required by spec scenarios.
- Alternatives considered:
  - Startup gating only: does not cover runtime backend restarts.
  - Runtime retry only: still allows avoidable failures during initial stack boot.

## Decision 7: API contract and versioning impact
- Decision: Do not change business endpoints; keep `/api/v1/*` and verify non-regression of Swagger/OpenAPI access.
- Rationale: Feature scope is orchestration and packaging, not API redesign.
- Alternatives considered:
  - Introduce proxy path translation in frontend container: unnecessary complexity and potential regressions.
  - Version bump for compose change: not justified because endpoint contracts remain unchanged.
