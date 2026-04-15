# Research: Proxy Compose Solo Frontend Puerto 80

## Decision 1: Usar Nginx existente como unico punto de entrada publico
- Decision: Mantener el servicio `nginx` existente como gateway unico y publicar solo su puerto 80 hacia el host.
- Rationale: El repositorio ya usa Nginx para servir frontend y enrutar API; minimiza cambios y riesgo.
- Alternatives considered:
  - Crear un nuevo servicio proxy dedicado: descartado por complejidad innecesaria.
  - Exponer frontend sin proxy: descartado porque no centraliza enrutamiento ni politica de exposicion.

## Decision 2: Restringir backend y DB a red interna Docker
- Decision: Mantener `app` y `postgres` sin mapeo de puertos al host, accesibles solo por red `internal`.
- Rationale: Cumple el requerimiento de no exponer servicios internos y reduce superficie de ataque local.
- Alternatives considered:
  - Publicar backend en localhost solamente: descartado por romper el criterio de aislamiento interno total.
  - Publicar puertos para debugging temporal: descartado por inconsistencia con el objetivo de feature.

## Decision 3: Definir puerto host fijo 80 para el gateway
- Decision: La entrada publica sera `http://localhost:80`.
- Rationale: El requerimiento del feature especifica puerto 80 como acceso unico del frontend.
- Alternatives considered:
  - Mantener puerto configurable (4200 por defecto): descartado porque no garantiza cumplimiento estricto.
  - Usar otro puerto por compatibilidad local: descartado en esta iteracion por alcance explícito.

## Decision 4: Comportamiento de error del proxy sin personalizacion
- Decision: Cuando frontend interno no este disponible, el proxy responde con error HTTP estandar (502/504) sin pagina custom.
- Rationale: Simplifica implementacion y conserva comportamiento nativo de Nginx.
- Alternatives considered:
  - Pagina de error amigable: descartado por no ser requisito y ampliar alcance.
  - Fallback con respuesta 200: descartado por ocultar fallas operativas.

## Decision 5: Alcance sin HTTPS/TLS
- Decision: Implementar solo HTTP en puerto 80, sin terminacion TLS en esta feature.
- Rationale: Alinea exactamente con el requerimiento confirmado durante clarificaciones.
- Alternatives considered:
  - HTTP+HTTPS con redireccion: descartado por complejidad adicional fuera de alcance.
  - Solo HTTPS: descartado por no solicitado y requerir gestion de certificados.

## Best Practices aplicadas
- Mantener una sola frontera de exposicion de red por entorno local.
- Evitar cambios en contratos API de negocio cuando el cambio es de topologia de red.
- Verificar rutas funcionales clave (`/` y `/api/*`) tras cambios de gateway.
- Validar que no existan puertos publicados accidentalmente en servicios internos.

## Resultado de investigación
No quedan puntos NEEDS CLARIFICATION para este feature. Alcance, comportamiento de errores y politica de exposicion quedaron definidos.
