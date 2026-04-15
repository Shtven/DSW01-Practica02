# Data Model: Proxy Compose Solo Frontend Puerto 80

Este feature no introduce entidades de dominio de negocio ni cambios de esquema en PostgreSQL. Se define un modelo operativo para validar comportamiento de red y enrutamiento.

## Entity: ComposeService
- Description: Representa un servicio definido en Docker Compose dentro del stack local.
- Fields:
  - `name` (string, required): identificador del servicio (`postgres`, `app`, `nginx`).
  - `networkScope` (enum, required): `internal-only` | `host-exposed`.
  - `publishedPorts` (array<int>, optional): puertos publicados al host.
  - `dependsOn` (array<string>, optional): servicios de los que depende.
- Validation Rules:
  - Solo `nginx` puede tener `networkScope = host-exposed`.
  - `app` y `postgres` deben tener `publishedPorts` vacio.

## Entity: ProxyRoute
- Description: Ruta HTTP atendida por el proxy Nginx para frontend y API.
- Fields:
  - `publicPath` (string, required): ruta expuesta al usuario (`/`, `/api/*`).
  - `upstreamService` (string, required): servicio destino interno (`nginx-static` o `app`).
  - `failureMode` (enum, required): `standard-http-error`.
- Validation Rules:
  - `publicPath=/` debe resolver contenido frontend.
  - `publicPath` bajo `/api/*` debe enrutar al backend interno.
  - En fallo de upstream se debe observar 502 o 504 sin custom page.

## Entity: ExposurePolicy
- Description: Politica declarativa de exposicion de puertos para el entorno local.
- Fields:
  - `publicEntryPort` (int, required): 80.
  - `tlsEnabled` (boolean, required): false.
  - `allowedHostExposedServices` (array<string>, required): [`nginx`].
- Validation Rules:
  - `publicEntryPort` debe ser 80 para esta feature.
  - `tlsEnabled` debe permanecer `false` en este alcance.

## Relationships
- `ExposurePolicy` 1..1 gobierna N `ComposeService`.
- `ComposeService(name=nginx)` 1..N expone `ProxyRoute`.

## State Transitions
- Compose stack state:
  - `stopped` -> `starting` -> `healthy` -> `degraded` -> `stopped`.
- Proxy route state:
  - `available` cuando upstream responde.
  - `unavailable` cuando upstream falla, con salida HTTP 502/504.
