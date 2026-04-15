# Quickstart: Proxy Compose Solo Frontend Puerto 80

## Prerequisites
- Docker Engine/Docker Desktop con Compose v2.
- Puerto 80 disponible en host local.

Si el puerto 80 esta ocupado, libera el proceso que lo usa o detiene servicios que publiquen `:80` antes de iniciar el stack.

## 1) Build and start stack

```bash
docker compose -f docker/compose.yml up -d --build
```

## 2) Validate public entrypoint

```bash
curl -i http://localhost:80/
```

Expected:
- Codigo 200 (o equivalente de exito) para frontend.
- Contenido HTML del frontend.

## 3) Validate backend path through proxy

```bash
curl -i http://localhost:80/api/v1/empleados
```

Expected:
- Respuesta consistente con seguridad actual (por ejemplo 401 sin credenciales).
- Ruta servida a traves del proxy, no por puerto backend expuesto.

## 4) Validate internal services are not host-exposed

```bash
docker compose -f docker/compose.yml ps
```

Expected:
- Solo `nginx` con publicacion de puerto en host (`*:80->80/tcp`).
- `app` y `postgres` sin mapeos de puerto al host.

## 5) Validate degraded behavior

```bash
docker compose -f docker/compose.yml stop app
curl -i http://localhost:80/api/v1/empleados
docker compose -f docker/compose.yml start app
```

Expected:
- Durante la caida de upstream, respuesta HTTP estandar de proxy (502/504) sin pagina personalizada.

## 6) Validate frontend build evidence

```bash
docker build -f frontend/Dockerfile -t empleados-frontend:local frontend
```

Expected:
- Build del frontend completado sin errores.
- Imagen local disponible para uso en validaciones operativas.

Registro de evidencia:

- Build status: ________
- Image tag: empleados-frontend:local

## 7) Validate versioned API compatibility after build

```bash
curl -i http://localhost:80/api/v1/empleados
```

Expected:
- La ruta versionada `/api/v1/*` sigue accesible a traves del proxy.
- La respuesta mantiene comportamiento de seguridad esperado (por ejemplo 401 sin credenciales).

Registro de evidencia:

- Status code observado: ________

## 8) Measure SC-004 startup time (3 runs)

Para cada corrida, iniciar desde stack detenido y medir tiempo hasta respuesta exitosa en `/`.

```bash
# Run 1
docker compose -f docker/compose.yml down
# iniciar cronometro
docker compose -f docker/compose.yml up -d --build
curl -i http://localhost:80/

# Run 2
docker compose -f docker/compose.yml down
# iniciar cronometro
docker compose -f docker/compose.yml up -d --build
curl -i http://localhost:80/

# Run 3
docker compose -f docker/compose.yml down
# iniciar cronometro
docker compose -f docker/compose.yml up -d --build
curl -i http://localhost:80/
```

Registro de tiempos:

- Run 1: ________
- Run 2: ________
- Run 3: ________

Criterio de aceptacion:

- Las 3 corridas deben ser menores o iguales a 5 minutos.

Conclusiones de validacion final:

- SC-004 cumplido: SI/NO
- Observaciones: ______________________________

## 9) Stop stack

```bash
docker compose -f docker/compose.yml down
```
