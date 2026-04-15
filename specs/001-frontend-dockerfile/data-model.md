# Data Model: Frontend Dockerfile Startup

## Entity: FrontendDockerfileDefinition
- Description: Build and runtime definition for frontend containerized execution.
- Fields:
  - dockerfilePath: string (`frontend/Dockerfile`)
  - baseImage: string (Node.js runtime image)
  - workdir: string
  - startupCommand: string (`ng serve`)
  - exposedContainerPort: integer (`4200` default)
  - startupValidation: enum (`fail-fast-on-missing-env`)
- Validation rules:
  - Dockerfile must build successfully in local Docker environment.
  - startupCommand must start Angular dev server in container context.

## Entity: FrontendRuntimeConfiguration
- Description: Runtime parameters required to execute frontend container correctly.
- Fields:
  - frontendPort: integer (env-configurable, default `4200`)
  - apiBaseUrl: string (`API_BASE_URL`, required)
  - restartPolicy: enum (`on-failure`)
  - restartMaxRetries: integer (documented bounded value)
- Validation rules:
  - `API_BASE_URL` must be present at runtime, otherwise startup fails with clear error.
  - frontendPort must be documented and host-accessible.

## Entity: FrontendContainerInstance
- Description: Running frontend container serving Angular UI for local validation.
- Fields:
  - imageTag: string
  - containerName: string
  - status: enum (`created`, `running`, `failed`, `restarting`)
  - hostPortBinding: string
  - apiConnectivityState: enum (`configured`, `misconfigured`, `reachable`, `unreachable`)
- Validation rules:
  - Container must reach running state and expose UI.
  - Login + read flow must remain functional when API is reachable.

## Entity: FrontendDockerRunGuide
- Description: Operational documentation for build/run/stop/troubleshooting.
- Fields:
  - buildCommand: string
  - runCommandTemplate: string
  - stopCommand: string
  - requiredEnvVars: list (`API_BASE_URL`, optional `FRONTEND_PORT`)
  - troubleshootingSteps: list
- Validation rules:
  - Commands must be reproducible in clean local environment.
  - Guide must enable onboarding success without direct support.

## State Transitions

### FrontendContainerInstance
- `created` -> `running` when startup command succeeds and port is bound.
- `created` -> `failed` when required env vars are missing.
- `failed` -> `restarting` when restart policy triggers.
- `restarting` -> `running` when retry succeeds within bounded attempts.
- `restarting` -> `failed` when retry limit is reached.
