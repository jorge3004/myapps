# myapps

Monorepo para la gestión centralizada de aplicaciones, usuarios, API keys y Single Sign-On (SSO).

## Estructura principal

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

## Descripción
- **backend/**: API central y lógica de negocio principal.
- **frontend/**: Dashboard de administración y panel central.
- **apps/**: Aplicaciones modulares (ejemplo: catalog, print3d) con sus propios backends y frontends.
- **_docs/**: Documentación técnica y de arquitectura.

## Primeros pasos
1. Clona el repositorio: `git clone git@github.com:jorge3004/myapps.git`
2. Instala dependencias en cada módulo según corresponda (ver README en cada subcarpeta).
3. Consulta la documentación en `_docs/` para detalles de arquitectura y flujos.

## Convenciones
- Usa ramas feature/bugfix/hotfix según el flujo de trabajo de tu equipo.
- Documenta cambios relevantes en `_docs/`.

---

> Para más detalles, consulta el archivo `_docs/architecture-map-2026-05-09.md`.
