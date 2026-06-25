# 02 - App Access Gate
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

Pregunta que responde:
- Puede entrar a esta app?

Fuente principal:
- [../authz/02_APP_ACCESS_GATE.md](../authz/02_APP_ACCESS_GATE.md)

Resumen:
- Para usuarios: se valida relacion en `user_apps`.
- Para app tokens: se valida api key activa y asociacion correcta.
- Sin acceso base a app, no hay ingreso aunque existan scopes directos.
