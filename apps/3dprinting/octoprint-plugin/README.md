# 3DPrinting – Plugin OctoPrint (Python)

Aquí vivirá el plugin que corre **dentro** del servidor OctoPrint (externo, en la Raspberry/PC de la impresora). Origen: repo privado `jorge3004/JIR3D-OCTOPRINT-SCRIPT` (`octoprint_jir3d/__init__.py`).

El código se migra por partes, contra un contrato de API tipado definido en el backend. No se instala con el monorepo Node: se empaqueta con `setup.py`/`pyproject.toml` y se instala en OctoPrint (`pip install`).

Ver el plan en [notas_3dprinting.md](../../../_docs/notas/notas_3dprinting.md).

## Hello world (2026-10-30)

Plugin mínimo en [octoprint_myapps3d/__init__.py](./octoprint_myapps3d/__init__.py): al arrancar OctoPrint escribe una línea en el log. Ajustes: `backend_url` y `api_key` (la API key con scopes del backend; no se versiona).

Instalar en el venv de OctoPrint: `pip install -e .` y reiniciar OctoPrint; buscar `MyApps3D: hello world` en `octoprint.log`.
