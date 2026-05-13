# Quickstart: GitHub Workflow Front and Back Unit Tests

## Goal
Validar que el workflow de CI ejecuta pruebas unitarias separadas de frontend y backend en eventos `push` y `pull_request` sobre `master` y `develop`.

## Implementacion realizada
- Workflow implementado en `.github/workflows/unit-tests.yml`.
- Jobs de pruebas unitarias:
  - `frontend-unit-tests` con Node LTS y comando directo `npm test`.
  - `backend-unit-tests` con Java 17 y comando directo `mvn -B test`.
- Politica de permisos globales: `contents: read`.
- Estrategia fail-fast operativa: bloqueo de validaciones dependientes posteriores mediante job `post-validation-gate` con `needs`.

## Prerequisites
- Permisos para crear ramas y abrir pull requests en el repositorio.
- Archivo de workflow disponible en `.github/workflows/unit-tests.yml`.
- Comandos de pruebas funcionales para frontend y backend en el repo.

## 1) Validate trigger on push
1. Crear una rama de prueba desde `develop`.
2. Hacer un commit pequeno y push.
3. Confirmar en GitHub Actions que se inicia el workflow para el evento push.

Expected:
- Run visible en Actions.
- Dos jobs definidos: frontend y backend.

## 2) Validate trigger on pull request
1. Abrir PR desde la rama de prueba hacia `develop`.
2. Confirmar que el workflow se dispara por evento `pull_request`.

Expected:
- Se inicia una nueva corrida por PR.
- Se mantienen dos jobs separados.

## 3) Validate job separation and runtimes
- Verificar que el job frontend usa runtime Node LTS.
- Verificar que el job backend usa Java 17.
- Verificar que cada job ejecuta su comando de prueba directo.

## 4) Validate fail-fast behavior
1. Introducir una falla intencional en una sola capa.
2. Ejecutar workflow (push o PR).

Expected:
- Workflow finaliza en estado `failed`.
- Job `post-validation-gate` no debe ejecutarse cuando falla un job de pruebas.

## 5) Validate permission policy
- Revisar YAML del workflow y confirmar:

```yaml
permissions:
  contents: read
```

## Verificacion constitucional

### Antes de implementacion
- Runtime: PASS. Esta feature no cambia el baseline de Java 17 ni Spring Boot 3.x.
- Frontend: PASS. Esta feature no cambia el baseline de Angular 21.x.
- Seguridad: PASS. No modifica autenticacion HTTP Basic ni credenciales base/equivalentes.
- Datos: PASS. No hay cambios de persistencia ni migraciones PostgreSQL.
- API/Contratos: PASS. No hay cambios de endpoints, versionado ni contrato OpenAPI.
- Entrega: PASS. Se agrega automatizacion CI sin alterar la arquitectura funcional.

### Antes de merge
- MUST incluir evidencia de ejecucion en PR con:
  - Resultado del job `frontend-unit-tests`.
  - Resultado del job `backend-unit-tests`.
  - Estado final del workflow (`success`/`failed`).
- La evidencia MUST mantenerse en este archivo.

## Verificacion de no-regresion de baseline
- Backend baseline (Java 17 / Spring Boot 3.x): sin cambios de codigo de aplicacion por esta feature.
- Frontend baseline (Angular 21 / Node LTS para tests): sin cambios funcionales de aplicacion por esta feature.

## Evidence Checklist Template
- [ ] SC-001: Push a master/develop dispara workflow.
- [ ] SC-002: Pull request a master/develop dispara workflow.
- [ ] SC-003: Dos jobs separados visibles en cada corrida.
- [ ] SC-004: Fallo intencional produce workflow fallido y bloqueo de validaciones dependientes.

## Bitacora de validacion integral
- [ ] Validacion de triggers en `push`.
- [ ] Validacion de triggers en `pull_request`.
- [ ] Validacion de runtimes y comandos directos por job.
- [ ] Validacion de permisos minimos del token.
- [ ] Validacion de comportamiento ante fallo.
- [ ] Validacion final de consistencia workflow-contrato.
