<!--
Sync Impact Report
- Version change: 0.0.0-template → 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] → I. Backend-First con Spring Boot 3 y Java 17
	- [PRINCIPLE_2_NAME] → II. Seguridad Obligatoria con Basic Auth
	- [PRINCIPLE_3_NAME] → III. Persistencia PostgreSQL y Contratos de Datos
	- [PRINCIPLE_4_NAME] → IV. Entrega Contenerizada con Docker
	- [PRINCIPLE_5_NAME] → V. Contratos API y Documentación Swagger
- Added sections:
	- Restricciones Técnicas Obligatorias
	- Flujo de Desarrollo y Puertas de Calidad
- Removed sections: None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ⚠ pending (not found): .specify/templates/commands/*.md
	- ⚠ pending (not found): README.md
	- ⚠ pending (not found): docs/quickstart.md
- Follow-up TODOs:
	- TODO(COMMAND_TEMPLATES): Crear .specify/templates/commands/ cuando exista automatización de comandos.
	- TODO(RUNTIME_GUIDE): Agregar README.md o docs/quickstart.md con referencia explícita a esta constitución.
-->

# DSW01-Practica02 Constitution

## Core Principles

### I. Backend-First con Spring Boot 3 y Java 17
Todo desarrollo del servicio backend MUST ejecutarse sobre Spring Boot 3.x y Java 17.
No se permiten features nuevas en versiones anteriores de Java o Spring. Cualquier excepción
MUST documentar su justificación técnica y un plan de migración para volver al baseline.
Rationale: mantener soporte LTS, seguridad y compatibilidad de dependencias.

### II. Seguridad Obligatoria con Basic Auth
Todos los endpoints de negocio MUST requerir autenticación HTTP Basic. Las credenciales de
entorno base MUST ser `admin` / `admin123` para entorno local de desarrollo y pruebas
controladas. En ambientes no locales, estas credenciales MUST externalizarse mediante
variables de entorno o secret manager, sin valores hardcodeados en código Java.
Rationale: establecer una seguridad mínima uniforme y verificable desde el inicio.

### III. Persistencia PostgreSQL y Contratos de Datos
La persistencia transaccional MUST usar PostgreSQL. El acceso a datos MUST realizarse con
entidades y repositorios versionados por migraciones de esquema (por ejemplo, Flyway o
Liquibase cuando aplique). Cambios incompatibles de esquema MUST incluir estrategia de
migración y rollback.
Rationale: asegurar consistencia de datos y evolución segura del modelo relacional.

### IV. Entrega Contenerizada con Docker
El backend MUST ser ejecutable en contenedor Docker y MUST declararse una estrategia de
orquestación local (Docker Compose o equivalente) para levantar aplicación y PostgreSQL.
La configuración de infraestructura local MUST ser reproducible por cualquier desarrollador
con comandos documentados.
Rationale: reducir diferencias entre entornos y facilitar integración continua.

### V. Contratos API y Documentación Swagger
Toda API REST MUST exponer documentación OpenAPI/Swagger actualizada y accesible, incluyendo
requerimientos de autenticación, códigos de error y ejemplos de payload cuando sea posible.
Ningún endpoint productivo se considera terminado si no aparece en la especificación.
Rationale: mejorar trazabilidad funcional y consumo seguro por clientes.

## Restricciones Técnicas Obligatorias

- Runtime MUST ser Java 17.
- Framework backend MUST ser Spring Boot 3.x.
- Base de datos MUST ser PostgreSQL.
- Seguridad de API MUST usar HTTP Basic Authentication.
- Documentación de API MUST publicarse con Swagger/OpenAPI.
- Configuración sensible SHOULD residir en variables de entorno para despliegues remotos.

## Flujo de Desarrollo y Puertas de Calidad

1. Todo cambio MUST iniciar con una especificación funcional y técnica trazable.
2. Todo PR MUST incluir evidencia de compilación exitosa y pruebas relevantes.
3. Todo cambio de endpoint MUST actualizar Swagger/OpenAPI en el mismo PR.
4. Todo cambio de persistencia MUST incluir migración de esquema y validación de impacto.
5. Todo cambio de infraestructura local MUST mantener ejecución por Docker sin pasos manuales
	 ocultos.

## Governance

Esta constitución prevalece sobre prácticas ad-hoc del repositorio.

- Procedimiento de enmienda: cualquier modificación MUST documentar motivo, impacto,
	compatibilidad y fecha, y MUST actualizar esta constitución en el mismo cambio.
- Política de versionado constitucional (SemVer):
	- MAJOR: elimina o redefine principios de forma incompatible.
	- MINOR: agrega principios o expande requisitos de forma material.
	- PATCH: clarifica redacción sin cambiar obligaciones normativas.
- Revisión de cumplimiento: cada plan, spec y tasks MUST incluir verificación explícita de
	cumplimiento constitucional antes de implementación y antes de merge.

**Version**: 1.0.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-02-25
