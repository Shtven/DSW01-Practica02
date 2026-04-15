# Quickstart: Frontend Dockerfile Simplification

## Goal
Construir y ejecutar el frontend con un unico Dockerfile (`frontend/Dockerfile`),
sin dependencia de `frontend/docker`, manteniendo compatibilidad con compose local.

## Prerequisites
- Docker y Docker Compose plugin instalados y en ejecucion.
- Puerto `4200` libre en host.
- Variable de runtime `API_BASE_URL` definida para el contenedor frontend.

## 1) Build frontend image
Desde la raiz del repositorio:

```bash
docker build -f frontend/Dockerfile -t empleados-frontend:local frontend
```

Resultado esperado:
- Build completado sin leer archivos desde `frontend/docker`.

## 2) Run frontend container with mandatory runtime config

```bash
docker run --rm -p 4200:80 -e API_BASE_URL=http://localhost:8080 empleados-frontend:local
```

Resultado esperado:
- Frontend disponible en `http://localhost:4200`.
- Si `API_BASE_URL` no esta presente, el contenedor falla rapido con mensaje claro.

## 3) Validate compose defaults

```bash
docker compose -f docker/compose.yml config
```

Verificar:
- Frontend publicado por defecto en `4200`.
- Backend y PostgreSQL sin publicacion de puerto host por defecto.

## 4) Start complete stack

```bash
FRONTEND_API_BASE_URL=http://app:8080 docker compose -f docker/compose.yml up -d --build
```

## 5) Smoke checks
- Abrir `http://localhost:4200`.
- Verificar que backend y DB siguen operando por red interna de compose.
- Verificar no-regresion de Basic Auth, `/api/v1/*` y Swagger/OpenAPI.

## 6) Stop stack

```bash
docker compose -f docker/compose.yml down
```
