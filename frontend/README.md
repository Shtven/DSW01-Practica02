# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Docker runtime (static build + nginx)

Build the frontend image from repository root:

```bash
docker build -f frontend/Dockerfile -t empleados-frontend:local frontend
```

Run with required API runtime configuration:

```bash
docker run --rm -p 4200:80 -e API_BASE_URL=http://localhost:8080 --restart on-failure:3 --name empleados-frontend empleados-frontend:local
```

Run with compose (API variable required):

```bash
FRONTEND_API_BASE_URL=http://app:8080 docker compose -f docker/compose.yml up -d --build
```

Important runtime notes:
- `API_BASE_URL` is mandatory in container mode; startup fails fast when it is missing.
- Frontend default host port in compose is `4200` mapped to container port `80`.
- Compose expects `FRONTEND_API_BASE_URL` to be provided explicitly.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Cypress login integration test (frontend + backend)

This repository includes a simple Cypress integration test that validates the login flow against the real backend.

1. Start backend on `http://localhost:8080`.
2. Start frontend on `http://localhost:4200`.
3. Install dependencies (first time only):

```bash
npm install
```

4. Run the login integration test:

```bash
npm run e2e:login
```

You can override runtime values with environment variables:

```bash
CYPRESS_BASE_URL=http://localhost:4200 \
CYPRESS_API_URL=http://localhost:8080 \
CYPRESS_USERNAME=admin@example.com \
CYPRESS_PASSWORD=admin123 \
npm run e2e:login
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
