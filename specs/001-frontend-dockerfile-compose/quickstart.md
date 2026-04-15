# Quickstart: Frontend + Backend + PostgreSQL in Docker Compose

## Goal
Levantar el stack completo con un solo comando, con frontend en contenedor (Angular build estatico servido por Nginx), backend Spring Boot y PostgreSQL.

## Prerequisites
- Docker Desktop (o Docker Engine + Compose plugin) en ejecucion.
- Puertos de host disponibles:
  - Frontend: puerto documentado de la feature (por defecto el definido en compose para UI).
- Credenciales locales base para pruebas funcionales: `admin` / `admin123` (o equivalente documentado cuando login es por correo).

## 1) Build and start
Desde la raiz del repositorio:

```bash
docker compose -f docker/compose.yml up -d --build
```

## 2) Verify service status
```bash
docker compose -f docker/compose.yml ps
```

Expected:
- `postgres` running
- `app` running (healthy si se define healthcheck)
- `frontend` running

## 3) Access application
- Abrir la UI en el puerto publicado del frontend (segun `docker/compose.yml`).
- Verificar login, al menos una lectura y al menos una operacion de escritura sobre API `/api/v1/*`.

## 4) Validate connectivity behavior
- Con backend disponible: UI responde sin reconfiguracion manual.
- Con backend temporalmente no disponible: UI muestra mensaje claro y aplica reintento automatico lineal con 2 reintentos (300ms y 600ms).

## 5) Stop stack
```bash
docker compose -f docker/compose.yml down
```

Para detener y limpiar volumen de datos local:
```bash
docker compose -f docker/compose.yml down -v
```

## Troubleshooting
- Puerto frontend ocupado:
  - Cambiar el puerto publicado del servicio frontend en `docker/compose.yml`.
- Frontend arriba pero sin datos:
  - Revisar valor runtime de API base URL y conectividad `frontend -> app` en red interna compose.
- Backend no saludable:
  - Revisar logs con `docker compose -f docker/compose.yml logs app`.
  - Confirmar que PostgreSQL este operativo y variables DB sean consistentes.
