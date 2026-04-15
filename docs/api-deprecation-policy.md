# API Deprecation and Migration Policy

## Scope
This policy defines how breaking API changes are introduced and communicated for the project API consumed by frontend clients.

## Versioning
- Public API routes must remain versioned (`/api/v1/*`).
- Breaking changes require a new major API version path.
- With Nginx gateway enabled, clients access API through `/api/*` and versioned paths must remain intact (`/api/v1/*`).

## Deprecation Process
1. Mark endpoint behavior as deprecated in API documentation.
2. Publish migration guidance with replacement endpoint behavior.
3. Maintain overlap period for old and new versions.
4. Remove deprecated version only after migration window and notice period.

## Migration Guidance Minimum Content
- What changed and why it is breaking.
- New endpoint/version to use.
- Request/response deltas.
- Cutoff timeline and rollback considerations.

## Verification
- Swagger/OpenAPI must reflect active and deprecated endpoints.
- Frontend integration checks should confirm compatibility with active API version.
- Proxy route checks must confirm `/api/*` forwarding preserves auth and version semantics.
