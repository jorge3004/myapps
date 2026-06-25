# Glosario Canonico Auth y AuthZ
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

Objetivo:
- Evitar mezcla de terminos entre autenticacion (AuthN) y autorizacion (AuthZ).
- Definir nombres canonicos para documentacion y conversaciones tecnicas.

## Terminos canonicos

| Termino canónico | Responde | Dominio | Documento principal |
|---|---|---|---|
| Authentication (AuthN) | Quien eres? | auth | [../auth/authentication-design.md](../auth/authentication-design.md) |
| Identity Prerequisite (AuthN dentro de flujo AuthZ) | La identidad ya fue validada? | authz | [../authz/01_IDENTITY_PREREQUISITE.md](../authz/01_IDENTITY_PREREQUISITE.md) |
| App Access Gate | Puedes entrar a esta app? | authz | [../authz/02_APP_ACCESS_GATE.md](../authz/02_APP_ACCESS_GATE.md) |
| Resource Authorization (AuthZ) | Que accion puedes ejecutar? | authz | [../authz/03_RESOURCE_AUTHORIZATION.md](../authz/03_RESOURCE_AUTHORIZATION.md) |
| Scope Convention | Como se expresa un permiso granular? | authz | [../authz/SCOPE_CONVENTION.md](../authz/SCOPE_CONVENTION.md) |

## Regla de uso rapido

- Si la pregunta es identidad o emision de token: AuthN y carpeta [../auth](../auth).
- Si la pregunta es acceso/permisos/alcance: AuthZ y carpeta [../authz](../authz).
- Si se explica el pipeline completo: usar esta secuencia:
  1. Identity Prerequisite (AuthN)
  2. App Access Gate
  3. Resource Authorization (AuthZ)

## Terminologia a evitar (por ambigua)

- "Authentication" para referirse a permisos de recursos.
- "Authorization" para referirse a login o emision de token.
- "role" sin contexto. Siempre especificar:
  - global role (users.role)
  - app role (user_apps.role)

## Notas de compatibilidad

Existen archivos puente para enlaces historicos:
- [../authz/01_AUTHENTICATION.md](../authz/01_AUTHENTICATION.md)
- [../auth/SCOPE_CONVENTION.md](../auth/SCOPE_CONVENTION.md)

No usarlos como fuente principal en documentos nuevos.
