# Quickstart - Departamentos Relacionados con Empleados

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

## 3) Verificar salud y documentacion

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

Credenciales Basic Auth locales:

- usuario: `admin`
- contrasena: `admin123`

## 4) Flujo minimo E2E

1. Crear departamento (sin enviar `clave`; la genera el sistema):

```bash
curl -u admin:admin123 -X POST http://localhost:8080/api/v1/departamentos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Finanzas"}'
```

2. Copiar `clave` de respuesta (ej. `D1`) y crear empleado asociado:

```bash
curl -u admin:admin123 -X POST http://localhost:8080/api/v1/empleados \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","direccion":"Calle 1","telefono":"555-111","departamentoClave":"D1"}'
```

3. Consultar departamento y validar lista de empleados por claves:

```bash
curl -u admin:admin123 http://localhost:8080/api/v1/departamentos/D1
```

4. Intentar eliminar departamento con empleados asociados (debe fallar con `400`):

```bash
curl -u admin:admin123 -X DELETE http://localhost:8080/api/v1/departamentos/D1
```

## 5) Validaciones esperadas

- `clave` de departamento autogenerada por sistema en formato `D` + digitos.
- `nombre` de departamento acepta hasta 100 caracteres.
- Respuesta de departamento incluye `empleados` como lista de claves de empleado.
- Alta/actualizacion de empleado rechaza `departamentoClave` inexistente.
- Eliminacion de departamento con empleados asociados se rechaza.
