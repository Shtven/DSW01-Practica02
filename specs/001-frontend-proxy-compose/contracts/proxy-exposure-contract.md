# Contract: Proxy Exposure and Routing

## Purpose
Definir el contrato externo observable del stack local tras aplicar la feature: unico acceso publico por puerto 80 para el frontend, con servicios internos no expuestos al host.

## Public Interface Contract

| Interface | Method | Path | Expected Behavior |
|---|---|---|---|
| Frontend entrypoint | GET | `/` | Responde contenido frontend servido por Nginx mediante `http://localhost:80/`. |
| Backend via proxy | Any HTTP | `/api/*` | El proxy reenvia peticiones al servicio backend interno conservando comportamiento actual. |
| Upstream failure | Any HTTP | `/api/*` | Si el upstream backend no esta disponible, Nginx devuelve error HTTP estandar (502/504) sin pagina personalizada. |

## Network Exposure Contract

| Service | Host Port Published | Internal Network Access |
|---|---|---|
| nginx | 80 | `internal` |
| app | none | `internal` |
| postgres | none | `internal` |

## Contract Invariants
- Solo existe un punto de acceso publico: `http://localhost:80`.
- No se publica ningun puerto de `app` ni `postgres` al host.
- No se habilita HTTPS/TLS en esta iteracion.
- No se alteran rutas versionadas de API existentes (`/api/v1/...`).

## Out of Scope
- Gestion de certificados TLS.
- Nuevos endpoints de negocio.
- Cambios en autenticacion backend.
