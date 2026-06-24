# Separación futura de la app Catalog

## Objetivo
Dejar preparada la app Catalog para poder aislarla y comercializarla como producto independiente en el futuro, sin necesidad de modificar el código actual.

## Buenas prácticas implementadas
- **Modularidad:** Toda la lógica de Catalog está en su propio módulo, desacoplada del backend central.
- **Routers exportables:** Catalog expone routers Express que pueden ser montados en cualquier backend.
- **Configuración por entorno:** Uso de variables de entorno y archivos `.env` para facilitar despliegue independiente.
- **API Key única:** Se recomienda generar y documentar un apiKey aleatorio para cada despliegue/instancia.
- **Sin dependencias cruzadas:** Catalog no depende de rutas ni lógica del backend central.
- **Documentación:** Endpoints, flujos de autenticación y uso de apiKey están documentados.

## Recomendaciones para facilitar la separación
1. **Mantener interfaces claras** entre módulos y servicios.
2. **No acoplar lógica de negocio** de Catalog al backend central.
3. **Scripts de build y start independientes** para Catalog.
4. **Documentar el apiKey** generado y su uso en pruebas/despliegues.
5. **Permitir configuración flexible** de puertos, rutas y variables de entorno.
6. **Pruebas y CI/CD independientes** para Catalog.

## Proceso sugerido para separación futura
1. Copiar el directorio `apps/catalog/backend-ts` a un nuevo repositorio.
2. Generar un nuevo apiKey seguro y configurarlo en `.env`.
3. Montar el router principal de Catalog en un servidor Express propio.
4. Actualizar la documentación y endpoints según el nuevo contexto.
5. Probar todos los flujos de autenticación y autorización.

## Nota
Actualmente, no es necesario realizar ninguna separación. Estas recomendaciones y estructura permiten que, si en el futuro se requiere, el proceso sea rápido, seguro y sin fricción.
