# Siguientes pasos recomendados

1. **Auditoría de acciones y cambios de permisos**
   - Implementar logs/auditoría para registrar quién, cuándo y qué cambios realiza sobre scopes, roles y usuarios.
   - Guardar información relevante: usuario que realiza la acción, usuario afectado, tipo de cambio, timestamp, valores antes/después.
   - Considerar endpoint para consultar historial de cambios por usuario.

2. **UI de administración (React + TypeScript recomendado)**
   - Crear una aplicación web para administrar apps, usuarios, roles y permisos.
   - Funcionalidades sugeridas:
     - Listar y buscar usuarios
     - Ver y editar roles/scopes de cada usuario
     - Crear, editar y eliminar apps
     - Visualizar historial de auditoría
   - Usar TypeScript en el frontend para mantener la robustez y coherencia de tipos con el backend.
   - Integrar autenticación JWT y protección de rutas en la UI.

> Estos pasos ayudarán a robustecer la seguridad, trazabilidad y facilidad de administración del sistema.
