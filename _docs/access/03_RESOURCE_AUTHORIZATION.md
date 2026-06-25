# 03 - Resource Authorization
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

Pregunta que responde:
- Que accion puede ejecutar el sujeto dentro de la app?

Fuente principal:
- [../authz/03_RESOURCE_AUTHORIZATION.md](../authz/03_RESOURCE_AUTHORIZATION.md)

Resumen:
- Se evalua `requireScope` con scopes efectivos.
- Fuentes tipicas: role por app, scopes directos y revoked scopes.
- Resultado de control: allow o 403 por scope insuficiente.
