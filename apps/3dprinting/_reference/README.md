# _reference/ (solo lectura)

Copia de referencia de `jorge3004/JIR3D` y sus submódulos (sin `.git`, `node_modules`, `.env`, `*.sql` ni ADMINER). **No es código del monorepo**: no se compila, no se lintea ni se importa desde `backend/` o `frontend/`. Se consulta y se migra por partes con tipado estricto.

Secretos (token de Thingiverse, contraseña de MySQL, IP del servidor) reemplazados por `REDACTED*`. Los valores originales siguen en el historial del repo JIR3D: hay que rotarlos.

Incluye el plugin completo en `OCTOPRINT/OctoPrint-Jir3d` (submódulo anidado).

Mapa: `NODE` (backend), `REACT` y `NEXT` (frontends), `OCTOPRINT` (plugin Python), `MYSQL`, `WEBSERVER` (nginx), `_ASSETS` y los `docker-compose*.yml` (referencia para [docker/](../../../docker/README.md)).
