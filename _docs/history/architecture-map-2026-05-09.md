# Arquitectura General Inicial (2026-05-09)

## 1. Estructura de Repositorio (Monorepo)

```
myapps/
  backend/         # Core API, gestión de apps, usuarios, apikeys, SSO, etc.
  frontend/        # Dashboard de gestión, UI centralizada
  apps/
    catalog/
      backend/
      frontend/
    print3d/
      backend/
      frontend/
  _docs/           # Documentación viva del sistema
```

- **Panel central:** myapps.tudominio.com
- **Apps:** catalog.tudominio.com, print3d.tudominio.com, etc.

---

## 2. Gestión de Aplicaciones y API Keys
- Cada app se registra con nombre, descripción, scopes/recursos, etc.
- Las API keys se generan a nivel de aplicación, no de usuario.
- Cada API key puede tener permisos/scopes específicos sobre recursos de la app.
- Las apps pueden tener usuarios internos (para acceso granular) o integrarse con el SSO central.

## 3. Gestión de Acceso y Seguridad
- Autenticación y autorización básica centralizada en el core.
- El core emite tokens temporales (JWT) para las apps, firmados y validados por el core.
- Las apps validan los tokens y consultan al core para scopes/roles si es necesario.
- SSO: un solo login para todas las apps.
- El core gestiona sesiones, refresh tokens, y federación de identidad.

## 4. Convenciones y Nombres
- apps/catalog/backend, apps/catalog/frontend
- apps/print3d/backend, etc.
- El core puede llamarse backend y frontend en la raíz.

## 5. Tecnologías y Patrones Sugeridos
- **Backend:** Node.js (Express, NestJS), TypeScript recomendado.
- **Frontend:** React, Next.js, o similar.
- **Autenticación:** JWT, OAuth2, OpenID Connect (si quieres federar con otros sistemas).
- **Base de datos:** MySQL/PostgreSQL para el core, cada app puede tener su propia DB si lo requiere.
- **Infraestructura:** Docker, Docker Compose, o Kubernetes para despliegue y aislamiento.

## 6. Siguientes Pasos Sugeridos
1. Crear el monorepo con la estructura propuesta.
2. Implementar el core backend con:
   - Gestión de aplicaciones
   - Gestión de API keys (a nivel app)
   - SSO y usuarios
   - Emisión y validación de tokens
3. Implementar el dashboard centralizado (frontend).
4. Integrar una app ejemplo (como catalog) para probar el flujo completo.
5. Documentar bien los endpoints y el flujo de autenticación/autorización.

---

## 7. Versionado de la Arquitectura
Cada vez que se reestructure el sistema, crea un nuevo archivo en `_docs/` con la fecha y un resumen de los cambios. Así tendrás un historial claro de la evolución del sistema.

---

> **Este documento es el mapa inicial. Actualiza o crea uno nuevo cada vez que cambie la arquitectura general.**
