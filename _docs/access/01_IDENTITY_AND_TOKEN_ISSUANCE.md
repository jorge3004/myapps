# 01 - Identity and Token Issuance
Ultima actualizacion: 2026-06-24
Estado: active
Ambito: actual

Pregunta que responde:
- Quien es el sujeto y como se emite el token?

Fuente principal:
- [../auth/authentication-design.md](../auth/authentication-design.md)

Resumen:
- Login de usuario: `POST /api/auth/login`
- Token de app por api key: `POST /api/auth/token`
- Resultado: identidad validada + token firmado + contexto base para evaluacion de acceso.
