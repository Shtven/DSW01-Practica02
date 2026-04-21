# DSW01-Practica02 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-25

## Active Technologies
- PostgreSQL (MUST) (001-crud-empleados)
- Java 17 + Spring Boot 3.x, Spring Security, Spring Data JPA, Bean Validation, springdoc-openapi, Flyway (001-departamentos-empleados-relacion)
- PostgreSQL 16 con migraciones Flyway (001-departamentos-empleados-relacion)
- Angular 21.x + TypeScript 5.x (frontend web MUST cuando aplique)
- Java 17 (backend MUST); TypeScript/Angular no aplica en este alcance + Spring Boot 3.x, Spring Security, Spring Data JPA, Bean Validation, springdoc-openapi, Flyway (001-empleados-email-auth)
- Java 17 (backend MUST) + TypeScript 5.x (frontend MUST when web UI applies) + Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, RxJS, Angular HttpClient (001-angular-api-integration)
- Java 17 (backend), TypeScript 5.9.x (frontend), Docker Compose spec + Spring Boot 3.3.x, Spring Security (Basic Auth), Spring Data JPA, Flyway, PostgreSQL 16, Angular 21.2.x, Nginx (frontend static serving) (001-frontend-dockerfile-compose)
- PostgreSQL (contenedor `postgres`) (001-frontend-dockerfile-compose)
- Java 17 (backend existente), TypeScript 5.9.x + Angular 21.2.x (frontend), Dockerfile syntax + Angular CLI 21 (`ng serve`), Node.js runtime image para contenedor frontend, Spring Boot 3.3.x API existente (001-frontend-dockerfile)
- PostgreSQL (existente; sin cambios de esquema en esta feature) (001-frontend-dockerfile)
- Java 17 (backend MUST) + TypeScript 5.x (frontend MUST when web UI applies) + Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, Docker Compose, Nginx runtime image (002-frontend-dockerfile-compose)
- Java 17 (backend), TypeScript 5.x (frontend Angular 21) + Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, Docker Compose, Nginx runtime image (001-frontend-dockerfile-build)
- PostgreSQL (sin cambio funcional) (001-frontend-dockerfile-build)
- Java 17 (backend) + TypeScript 5.x (frontend Angular 21) + Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, Nginx 1.27 (container) (001-nginx-compose-proxy)
- PostgreSQL 16 (compose service `postgres`) (001-nginx-compose-proxy)
- Java 17 (backend), TypeScript (Angular frontend), YAML (Docker Compose y Nginx templates) + Spring Boot 3.x backend, Angular frontend containerizado con Nginx, Docker Compose v2 (001-frontend-proxy-compose)
- PostgreSQL 16 en contenedor interno (001-frontend-proxy-compose)
- YAML (GitHub Actions), Java 17 (backend), TypeScript/Node LTS (frontend) + GitHub Actions runner, Maven Wrapper, npm scripts del frontend (001-github-workflow-tests)
- PostgreSQL (sin cambios en esta feature) (001-github-workflow-tests)

- Java 17 (MUST for backend work) + Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi (001-crud-empleados)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

# Add commands for Java 17 (MUST for backend work)

## API Versioning

- Public Spring Boot endpoints SHOULD follow `/api/v1/...` as default convention.
- Breaking changes SHOULD introduce a new major API version path.

## Code Style

Java 17 (MUST for backend work): Follow standard conventions
Angular 21.x (frontend web MUST when applicable): Use Angular CLI conventions and standalone-first architecture

## Recent Changes
- 001-github-workflow-tests: Added YAML (GitHub Actions), Java 17 (backend), TypeScript/Node LTS (frontend) + GitHub Actions runner, Maven Wrapper, npm scripts del frontend
- 001-frontend-proxy-compose: Added Java 17 (backend), TypeScript (Angular frontend), YAML (Docker Compose y Nginx templates) + Spring Boot 3.x backend, Angular frontend containerizado con Nginx, Docker Compose v2
- 001-nginx-compose-proxy: Added Java 17 (backend) + TypeScript 5.x (frontend Angular 21) + Spring Boot 3.x, Spring Security, Spring Data JPA, springdoc-openapi, Angular 21.x, Nginx 1.27 (container)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
