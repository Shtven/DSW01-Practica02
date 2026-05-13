# Data Model: GitHub Workflow Front and Back Unit Tests

## Entity: WorkflowTriggerRule
- Description: Rule set defining which repository events start CI.
- Fields:
  - events: set (`push`, `pull_request`)
  - branches: set (`master`, `develop`)
  - enabled: boolean
- Validation rules:
  - Event list must include both `push` and `pull_request`.
  - Branch filter must include exactly `master` and `develop` for this feature scope.

## Entity: UnitTestJob
- Description: Independent CI job that executes unit tests for one layer.
- Fields:
  - jobName: enum (`frontend-unit-tests`, `backend-unit-tests`)
  - layer: enum (`frontend`, `backend`)
  - runtime: string (`node-lts` or `java-17`)
  - command: string (direct command declared in workflow)
  - status: enum (`queued`, `running`, `success`, `failed`, `cancelled`, `skipped`)
- Validation rules:
  - Exactly two jobs must exist in the workflow.
  - Each job must have its own runtime and direct command.

## Entity: WorkflowPermissionProfile
- Description: Permission scope used by GITHUB_TOKEN during workflow execution.
- Fields:
  - scopeType: string (`global`)
  - contentsPermission: string (`read`)
- Validation rules:
  - Permission must be minimum read-only for repository contents.

## Entity: WorkflowRunResult
- Description: Aggregate result of one workflow execution.
- Fields:
  - runId: string
  - triggerEvent: enum (`push`, `pull_request`)
  - branch: string
  - failFastEnabled: boolean (`true`)
  - finalStatus: enum (`success`, `failed`, `cancelled`)
- Validation rules:
  - If any unit test job fails, final status must be `failed`.
  - With fail-fast enabled, non-started jobs may be cancelled.

## State Transitions

### UnitTestJob.status
- `queued` -> `running` when runner starts execution.
- `running` -> `success` when command exits 0.
- `running` -> `failed` when command exits non-zero.
- `queued` -> `cancelled` when fail-fast aborts pending work after another job failure.

### WorkflowRunResult.finalStatus
- `running` -> `success` when both jobs finish successfully.
- `running` -> `failed` when any job fails.
- `running` -> `cancelled` when run is manually cancelled.
