# Quickstart - Autenticacion por Correo de Empleado

## Prerrequisitos

- Java 17
- Maven 3.9+
- Docker y Docker Compose

## 1) Levantar infraestructura local

```bash
docker compose -f docker/compose.yml up -d --build
```

## 2) Ejecutar backend

```bash
mvn spring-boot:run
```

## 3) Verificar documentacion

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## 4) Flujo minimo de migracion y autenticacion

1. Iniciar sesion con cuenta admin bootstrap por correo real (configurada por entorno).
2. Crear/actualizar empleados legacy para reemplazar correos temporales `@local.invalid` por correos reales.
3. Verificar que login con correo temporal sea rechazado (`401`).
4. Verificar que login con correo real + contrasena sea aceptado (`200`).

Ejemplo de consulta autenticada:

```bash
curl -u admin@example.com:admin123 http://localhost:8080/api/v1/empleados?page=0&size=10
```

Credencial local equivalente documentada para login por correo:

- identificador admin: `admin@example.com`
- secreto base local: `admin123`

Ejemplo esperado de rechazo por correo temporal:

```bash
curl -u e15@local.invalid:Clave1234 http://localhost:8080/api/v1/empleados?page=0&size=10
```

## 5) Validaciones esperadas

- Login Basic Auth solo por `correo` + `contrasena`.
- `correo` con validacion de formato y unicidad case-insensitive.
- Backfill legacy `<clave>@local.invalid` aplicado sin detener servicio.
- Correos temporales bloqueados para autenticacion.
- Reemplazo de correo temporal permitido solo para administrador autenticado.
- Rutas versionadas mantienen prefijo `/api/v1`.
- Medicion de p95 sobre flujo autenticado (minimo 100 solicitudes) documentada con resultado objetivo `< 2s`.

## 6) Matriz cuantificada para SC-001, SC-002 y SC-003

Ejecutar al menos 30 casos totales y registrar resultado por caso.

| Caso | Tipo | Credencial/Payload | Esperado | Resultado |
|------|------|---------------------|----------|-----------|
| C01-C10 | SC-001 | correo real + contrasena valida | 200 | PENDIENTE |
| C11-C20 | SC-002 | correo inexistente o contrasena invalida | 401 | PENDIENTE |
| C21-C30 | SC-003 | create/update con correo invalido o duplicado | 400 | PENDIENTE |

Regla de aceptacion:

- SC-001: 10/10 exitos con 200.
- SC-002: 10/10 rechazos con 401.
- SC-003: 10/10 rechazos con 400.

## 7) Metodologia p95 (SC-004)

1. Seleccionar una operacion CRUD autenticada representativa (por ejemplo `GET /api/v1/empleados?page=0&size=10`).
2. Ejecutar 100 solicitudes autenticadas con correo real no temporal.
3. Registrar tiempos individuales y calcular p95.
4. Criterio de cumplimiento: p95 `< 2s`.

Plantilla de registro:

- Fecha ejecucion: PENDIENTE
- Endpoint medido: PENDIENTE
- Muestra: 100 solicitudes
- p95 observado: PENDIENTE
- Cumple SC-004: PENDIENTE
