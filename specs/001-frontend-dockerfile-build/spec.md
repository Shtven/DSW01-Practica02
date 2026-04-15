# Feature Specification: Frontend Dockerfile Simplification

**Feature Branch**: `001-frontend-dockerfile-build`  
**Created**: 2026-04-08  
**Status**: Draft  
**Input**: User description: "elimina la carpeta docker del frontend y en su lugar crea un dockerfile que construya el frontend"

## Clarifications

### Session 2026-04-08

- Q: Should the frontend container define a default API base URL when runtime variable is missing? → A: No default; API base URL is always mandatory and startup must fail if missing.
- Q: What frontend runtime model should this feature enforce? → A: Static build served by a web server runtime image.
- Q: What should happen to the existing frontend/docker folder? → A: Remove it physically from the repository.

### Session 2026-04-13

- Q: What should be the default host port for frontend in local compose? → A: Keep host port 4200 by default.
- Q: Should backend and database be published to host by default in local compose? → A: Keep backend and database internal-only by default.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Build Frontend Image with One Dockerfile (Priority: P1)

As a developer, I can build a frontend container image using only the main frontend Dockerfile, without depending on a separate frontend docker folder.

**Why this priority**: This is the core user request and the minimum slice needed to simplify container build and reduce maintenance overhead.

**Independent Test**: Can be fully tested by building the frontend image from the frontend directory and verifying the build finishes successfully without requiring files from a frontend docker subfolder.

**Acceptance Scenarios**:

1. **Given** the repository is in a clean state, **When** a user runs the documented frontend image build command, **Then** the build succeeds using the frontend Dockerfile as the only required container build definition.
2. **Given** the previous frontend docker folder is removed, **When** the frontend image is built, **Then** the build process does not fail due to missing files from that removed folder.

---

### User Story 2 - Keep Startup Behavior Predictable (Priority: P2)

As an operator, I can run the built frontend container and get a predictable startup behavior that matches the documented prerequisites and serves prebuilt static assets.

**Why this priority**: After build simplification, startup reliability is needed so the change remains usable in local orchestration and onboarding flows.

**Independent Test**: Can be tested by running the container with required runtime configuration and verifying the container stays running and serves the frontend assets.

**Acceptance Scenarios**:

1. **Given** a successfully built frontend image, **When** the container starts with required runtime variables, **Then** it remains healthy and serves the application.
2. **Given** required runtime configuration is missing, **When** the container starts, **Then** it fails fast with a clear error message.

---

### User Story 3 - Keep Documentation Aligned (Priority: P3)

As a team member, I can follow updated project docs that describe the new frontend container build approach with no references to removed folder structure.

**Why this priority**: Accurate documentation prevents confusion and onboarding friction after structural changes.

**Independent Test**: Can be tested by reviewing frontend and compose documentation and confirming they reference only the current Dockerfile-based approach.

**Acceptance Scenarios**:

1. **Given** the feature is implemented, **When** a new contributor reads the relevant docs, **Then** they can build and run the frontend container without additional tribal knowledge.

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- The frontend build is triggered from repository root versus frontend directory.
- Runtime API base URL is empty, malformed, or points to an unreachable backend.
- Compose references paths that no longer exist after removing the frontend docker folder.
- Host access to backend or database is attempted even though they are internal-only by default in compose.
- Existing backend and database services must continue startup unaffected by frontend folder restructuring.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The backend MUST start successfully in compose and keep expected internal service exposure (`app:8080`) after this feature change.
- **FR-002**: Protected business endpoints MUST continue rejecting unauthenticated requests and accepting valid authenticated requests after this feature change.
- **FR-003**: Baseline local credentials (`admin`/`admin123`, or documented equivalent when email login applies) MUST continue functioning in local environment.
- **FR-004**: PostgreSQL-backed persistence MUST remain operational for at least one authenticated read and one authenticated write flow after this feature change.
- **FR-005**: Swagger/OpenAPI documentation MUST remain reachable after this feature change.
- **FR-006**: Public API routes MUST continue using explicit versioned paths under `/api/v1/*` after this feature change.
- **FR-007**: System MUST remain executable in containerized local orchestration.
- **FR-008**: Existing API deprecation policy and migration guidance MUST remain available and unchanged after this feature change.
- **FR-009**: The frontend project structure MUST physically remove the dedicated frontend docker folder from the repository and eliminate runtime dependency on files under that folder.
- **FR-010**: The frontend container build MUST be defined and executable from the main frontend Dockerfile and produce deployable static frontend assets.
- **FR-011**: The frontend Dockerfile-based build flow MUST remain compatible with local compose orchestration defaults used by the project.
- **FR-011A**: The frontend container runtime MUST serve static build output via a web server runtime image rather than a development server process.
- **FR-011B**: Local compose defaults MUST expose frontend on host port 4200 unless explicitly overridden by user configuration.
- **FR-011C**: Local compose defaults MUST keep backend and database services internal-only (not published to host) unless explicitly overridden by user configuration.
- **FR-012**: The frontend container startup MUST provide deterministic behavior when required runtime configuration is present, with API base URL supplied explicitly at runtime.
- **FR-013**: The frontend container startup MUST fail fast and clearly when mandatory runtime configuration is missing, including when API base URL is not provided.
- **FR-014**: Project documentation MUST be updated to reflect the new frontend container build path and remove references to deleted frontend docker folder assets.
- **FR-015**: The feature MUST demonstrate no-regression evidence for authentication, API versioning, and API documentation availability in implementation checklist artifacts.

### Key Entities *(include if feature involves data)*

- **Frontend Build Definition**: Describes how the frontend container image is assembled, including required source artifacts and build entrypoint.
- **Frontend Runtime Configuration**: Defines mandatory runtime inputs the frontend container needs to start and correctly target backend services.
- **Container Orchestration Mapping**: Represents service references, startup dependencies, and path references needed to build and run services together.

### Assumptions

- Existing backend and database container definitions remain in scope only for compatibility verification, not redesign.
- The feature keeps current local orchestration behavior expectations for frontend access and backend communication.
- Internal compose networking is the default communication path between frontend, backend, and database.
- Existing API security model and route contracts remain unchanged.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 100% of documented frontend image builds complete successfully using the frontend Dockerfile as the only required frontend container build definition.
- **SC-002**: 100% of startup attempts without mandatory runtime configuration fail with an explicit, user-readable error message and measured wall-clock failure time <=30 seconds.
- **SC-003**: 100% of relevant project documents reference the updated frontend containerization flow and contain no references to removed frontend docker folder paths.
- **SC-004**: In smoke validation, the full local container stack reaches a usable state where frontend is accessible on default host port 4200 and backend endpoints remain reachable with no feature-related regressions.
- **SC-005**: In default compose configuration, backend and database services are not exposed on host ports while inter-service communication remains functional through compose internal networking.
