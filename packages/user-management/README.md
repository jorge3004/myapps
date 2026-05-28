# user-management

Módulo reutilizable para la gestión de usuarios en cualquier backend del monorepo.

## Características
- Lógica desacoplada de la base de datos
- Interfaces para adaptadores de persistencia
- Controladores y servicios reutilizables
- Configuración inyectable

## Estructura sugerida

```
user-management/
  src/
    index.ts
    controllers/
    services/
    adapters/
  README.md
  package.json
```

## Ejemplo de inicialización

```js
const userManagement = require('user-management');
userManagement.init({ userModel: MiModeloDeUsuario });
```

## Próximos pasos
- Definir interfaces y estructura base en `src/`
- Implementar primer adaptador de ejemplo
- Documentar casos de uso
