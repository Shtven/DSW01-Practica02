# Quickstart - Autenticacion por Empleado

## Prerrequisitos

- Java 17
- Maven 3.9+
- Docker y Docker Compose

## 1) Levantar infraestructura

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

## 4) Flujo minimo de validacion

El sistema crea un empleado bootstrap via migracion:

- usuario: `admin`
- contrasena: `Admin1234`

1. Crear departamento para asociar empleados:

```bash
curl -u admin:Admin1234 -X POST http://localhost:8080/api/v1/departamentos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Operaciones"}'
```

2. Crear empleado autenticable con contrasena valida:

```bash
curl -u admin:Admin1234 -X POST http://localhost:8080/api/v1/empleados \
  -H "Content-Type: application/json" \
  -d '{"nombre":"ana","contrasena":"clave1234","direccion":"Calle 1","telefono":"555-111","departamentoClave":"D1"}'
```

3. Consumir endpoint protegido usando credenciales del empleado:

```bash
curl -u ana:clave1234 http://localhost:8080/api/v1/empleados?page=0&size=10
```

4. Verificar rechazo con contrasena invalida:

```bash
curl -u ana:incorrecta http://localhost:8080/api/v1/empleados?page=0&size=10
```

## 5) Validaciones esperadas

- Login por Basic Auth con `nombre` y `contrasena` de empleado.
- Hash BCrypt para contrasena almacenada.
- Normalizacion de `nombre` a minusculas y unicidad case-insensitive.
- Politica minima de contrasena: 8+ caracteres con letra y numero.
- Contrato OpenAPI y rutas `/api/v1` consistentes con implementacion.
