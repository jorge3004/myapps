# GET /api/runtime/status
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

## Proposito

Endpoint de observabilidad del runtime por request.
Expone contexto efectivo, politicas activas y estado del health check de MySQL.

## Request

```http
GET /api/runtime/status
```

Headers opcionales:
- `x-runtime-env`
- `x-data-source`

## Response (resumen)

```json
{
	"status": "ok",
	"current": {
		"requestedEnvironment": "dev",
		"servedEnvironment": "dev",
		"requestedDataSource": "mysql",
		"servedDataSource": "mysql",
		"fallbackApplied": false,
		"mysqlAvailable": true,
		"operation": "read",
		"reason": null
	},
	"runtimeContext": {
		"dynamic": true,
		"note": null
	},
	"defaults": {
		"environment": "dev",
		"dataSource": "mysql"
	},
	"available": {
		"environments": ["dev", "prod"],
		"dataSources": ["mysql", "memory"]
	},
	"policy": {
		"fallbackReadToMemory": true,
		"readSemanticPostRoutes": ["/api/auth/login", "/api/auth/token"]
	},
	"mysqlHealthCache": {
		"cachedValue": true,
		"timeSinceLastCheck": "1.8s",
		"remaining": "13.2s",
		"ttl": "15.0s",
		"timeout": "3.0s",
		"dbLatency": "836ms",
		"lastCheckTimedOut": false
	}
}
```

## Campos clave

- `current.reason`:
	- `null`: flujo normal
	- `mysql_unavailable_read_fallback_memory`: MySQL no disponible, read con fallback
	- `mysql_unavailable_write_blocked`: write bloqueado por no disponibilidad de MySQL
	- `runtime_context_default_no_health_check`: contexto default (sin middleware)

- `mysqlHealthCache.dbLatency`:
	Tiempo real del ultimo probe de MySQL. Es el indicador mas util para decidir si `MYSQL_HEALTH_TIMEOUT_MS` esta demasiado ajustado.

- `mysqlHealthCache.lastCheckTimedOut`:
	`true` cuando el ultimo probe alcanzó timeout.

## Referencias

- [../testing/ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)
- [../navigation/next-steps.md](../navigation/next-steps.md)
