# Módulos Reutilizables (packages/)

Esta carpeta contendrá los módulos reutilizables de negocio y utilidades para todos los servicios del monorepo.

## Ejemplo de estructura

```
packages/
  user-management/      # Lógica y controladores de usuarios reutilizables
  app-management/       # Lógica para gestión de aplicaciones
  ...
```

Cada módulo debe ser desacoplado, configurable y documentado. Se recomienda usar TypeScript para máxima robustez y tipado.

## Convenciones
- Cada package debe tener su propio README.md, package.json y pruebas.
- La lógica de negocio debe estar desacoplada del acceso a datos (usar interfaces/adaptadores).
- La configuración (modelos, tablas, conexión) debe ser inyectable.
- Documentar ejemplos de uso en cada módulo.

---

> Consulta `_docs/architecture-map-2026-05-09.md` para la visión general y convenciones de arquitectura.
