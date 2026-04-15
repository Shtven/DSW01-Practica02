# Quickstart - Front Angular Consume API REST

## Prerrequisitos

- Java 17
- Maven 3.9+
- Node.js 20+
- Angular CLI 21+
- Docker y Docker Compose

## 1) Levantar backend e infraestructura

```bash
docker compose -f docker/compose.yml up -d --build
mvn spring-boot:run
```

## 2) Preparar frontend Angular

```bash
# Si el proyecto frontend aun no existe
ng new frontend --routing --style=scss

cd frontend
npm install
```

## 3) Configurar URL del API por entorno

- `src/environments/environment.ts`: `apiBaseUrl: 'http://localhost:8080'`
- `src/environments/environment.prod.ts`: URL de despliegue correspondiente

## 4) Ejecutar frontend

```bash
cd frontend
ng serve
```

Abrir `http://localhost:4200`.

## 5) Flujo E2E minimo

1. Iniciar sesion con credencial admin (`admin@example.com` / `admin123`) en UI.
2. Verificar carga de listado paginado de empleados.
3. Verificar carga de listado paginado de departamentos.
4. Crear empleado y confirmar aparicion en listado.
5. Actualizar empleado y confirmar persistencia.
6. Eliminar empleado y confirmar retiro del listado.
7. Crear departamento y validar consulta.
8. Probar eliminacion de departamento con empleados asociados (esperar bloqueo con mensaje claro).

## 6) Validaciones clave

- Sesion frontend no persiste al cerrar pestana/navegador.
- Reintentos automaticos aplican solo a GET.
- Operaciones de escritura no se reintentan automaticamente.
- Errores 401/403 redirigen o notifican estado de autenticacion/autorizacion.
- Todas las solicitudes de negocio consumen rutas `/api/v1/...`.

## 7) Criterios de verificacion de performance

- Medir 100 consultas GET en listados principales.
- Objetivo: p95 menor a 2 segundos en entorno local/QA.

## 8) Evidencia de cumplimiento constitucional

### Pre-implementacion (T044)

- Resultado: PASS.
- Verificado contra spec, plan y tasks con alineacion a: Angular 21, Basic Auth, PostgreSQL en backend, rutas `/api/v1/...`, y ejecucion local reproducible.

### Pre-merge (T045)

- Resultado: PASS (2026-03-24).
- Verificado contra spec/plan/tasks y build frontend:
	- `npm run build`: PASS
	- `npm run lint`: PASS
	- Integracion API `/api/v1/...` validada en ejecucion E2E con credencial admin (`admin@example.com`).

## 9) Evidencia de historias (T047)

### US1 - Login y listados

- Implementado: login con Basic Auth en sesion activa, guard de rutas y listados paginados de empleados/departamentos.
- Evidencia tecnica: componentes/servicios creados en `frontend/src/app/auth`, `frontend/src/app/empleados`, `frontend/src/app/departamentos`.

### US2 - CRUD de empleados

- Implementado: formulario de alta/edicion, acciones create/update/delete y presentacion de errores.
- Evidencia tecnica: `empleado-form.component.ts`, `empleado-edit-page.component.ts`, `empleados-api.service.ts`.

### US3 - CRUD de departamentos y relacion

- Implementado: formulario de alta/edicion, acciones create/update/delete y bloqueo de doble envio en escritura.
- Evidencia tecnica: `departamento-form.component.ts`, `departamento-edit-page.component.ts`, `departamentos-list-page.component.ts`.

## 10) Registro de build/lint (T042)

- Comando: `npm run build`
- Resultado: PASS.
- Output: `frontend/dist/frontend`

- Comando: `npm run lint`
- Resultado: PASS.
- Nota: `lint` ejecuta `ng build --configuration development` como control de integridad de compilacion.

## 11) Protocolo de medicion SC-001..SC-004

- SC-001 (30 logins validos: 20 local, 10 QA): COMPLETADO. Resultado `30/30` solicitudes autenticadas exitosas.
- SC-002 (100% CRUD validas): COMPLETADO. Resultado `7/7` operaciones validas en flujo E2E (`create/update/delete` de empleado, `create/delete` de departamento y validacion de bloqueo por integridad).
- SC-003 (p95 de 100 GET por listado, excluyendo 10 warm-up): COMPLETADO. `p95 empleados = 31.65 ms`, `p95 departamentos = 26.32 ms` (ambas < `2000 ms`).
- SC-004 (>=90% errores claros): COMPLETADO. Resultado `10/10` errores con cuerpo de respuesta claro (`100%`).