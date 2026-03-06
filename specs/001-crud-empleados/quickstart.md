# Quickstart - CRUD de Empleados

## Prerrequisitos

- Java 17
- Maven 3.9+
- Docker y Docker Compose

## 1) Levantar PostgreSQL con Docker

Ejemplo con Docker Compose:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: empleados-postgres
    environment:
      POSTGRES_DB: empleadosdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

Comando:

```bash
docker compose -f docker/compose.yml up -d --build
```

## 2) Variables de entorno sugeridas

- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_NAME=empleadosdb`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- `APP_BASIC_USER=admin`
- `APP_BASIC_PASSWORD=admin123`

## 3) Ejecutar aplicación

```bash
mvn spring-boot:run
```

## 4) Verificar API y documentación

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

Autenticación de prueba (Basic Auth):

- usuario: `admin`
- contraseña: `admin123`

## 5) Validaciones clave del MVP

- Alta de empleado sin `clave` en payload (autogenerada por sistema con formato `E` + secuencia numérica).
- Operaciones por identificador (`GET/PUT/DELETE`) solo con `clave` que cumpla patrón `E` + dígitos.
- Validación de `nombre`, `direccion`, `telefono` con máximo 100 caracteres.
- Listado obligatorio con `page` y `size`.
- Eliminación física de empleado.

## 6) Resultado de validación E2E (2026-03-06)

- Comando ejecutado: `docker compose -f docker/compose.yml up -d --build`
- Resultado: bloqueado por entorno local sin Docker Engine activo.
- Error observado: `open //./pipe/dockerDesktopLinuxEngine: El sistema no puede encontrar el archivo especificado.`
- Verificación adicional: `http://localhost:8080/swagger-ui/index.html` no accesible (`No es posible conectar con el servidor remoto`).

### Próximo paso para validar E2E

1. Iniciar Docker Desktop.
2. Ejecutar `docker compose -f docker/compose.yml up -d --build`.
3. Probar endpoints con Basic Auth (`admin/admin123`) en `http://localhost:8080`:
  - `POST /api/v1/empleados`
  - `GET /api/v1/empleados/{clave}`
  - `GET /api/v1/empleados?page=0&size=10`
  - `PUT /api/v1/empleados/{clave}`
  - `DELETE /api/v1/empleados/{clave}`
