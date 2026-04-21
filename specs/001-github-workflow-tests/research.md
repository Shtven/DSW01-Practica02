# Research: GitHub Workflow Front and Back Unit Tests

## Decision 1: Trigger scope
- Decision: Trigger workflow on `push` and `pull_request` for branches `master` and `develop` only.
- Rationale: Matches requested governance for main integration branches and avoids unnecessary runs on other branches.
- Alternatives considered:
  - Trigger on all branches: higher CI cost and noisier feedback.
  - Trigger only on pull_request: misses direct push validation.

## Decision 2: Job separation
- Decision: Define exactly two jobs, one for frontend unit tests and one for backend unit tests.
- Rationale: Improves fault isolation and accelerates triage by layer.
- Alternatives considered:
  - Single combined job: harder to pinpoint failing layer.
  - More than two jobs: out of requested scope.

## Decision 3: Runtime versions
- Decision: Use Node LTS for frontend job and Java 17 for backend job.
- Rationale: Aligns with clarified requirement and constitution baseline.
- Alternatives considered:
  - `latest` runtimes: unstable across time, less reproducible.
  - Multiple version matrix: higher runtime cost without requested value.

## Decision 4: Test command declaration
- Decision: Use direct test commands in workflow definition.
- Rationale: Explicit, simple, and consistent with clarification outcome.
- Alternatives considered:
  - Wrapper scripts: adds indirection not requested.
  - Dynamic command resolution: unnecessary complexity.

## Decision 5: Failure strategy
- Decision: Enable fail-fast behavior to stop remaining execution when a job fails.
- Rationale: Reduces wasted CI minutes and provides quick failure feedback.
- Alternatives considered:
  - Always run all jobs: more complete diagnostics but higher cost/time.
  - Sequential dependent stages: increases overall pipeline latency.

## Decision 6: Token permissions
- Decision: Set global workflow permission to `contents: read`.
- Rationale: Principle of least privilege; sufficient for checkout and test execution.
- Alternatives considered:
  - Default broad permissions: unnecessary privilege exposure.
  - Per-job custom permissions: valid but more verbose for same effective scope.
