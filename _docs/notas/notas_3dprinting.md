# Notas 3DPrinting (análisis de JIR3D y plan de migración)

App nueva en [apps/3dprinting/](../../apps/3dprinting): [backend](../../apps/3dprinting/backend), [frontend](../../apps/3dprinting/frontend) (vacío), [octoprint-plugin](../../apps/3dprinting/octoprint-plugin) (vacío). Solo existe `/health` en el backend.

Objetivo: buscar modelos 3D en Thingiverse, mostrarlos, y mandarlos a imprimir a una impresora con OctoPrint.

## Qué hay en `jorge3004/JIR3D` (privado, superrepo de submódulos)

| Submódulo | Contenido | ¿Reutilizar? |
|-----------|-----------|--------------|
| `JIR3D-NODE` | Express + Sequelize + MySQL + Socket.IO. Rutas: auth, carrito, files, impresoras, órdenes, repositorio, roles, usuarios. Hay `src/js` (el real) y `src/typeScript` (solo `user`). | Solo el **modelo de dominio** (impresoras, órdenes, carrito). Auth/usuarios/roles ya los cubre este monorepo. |
| `JIR3D-REACT` | Vite + React (JSX) + Redux + MUI + i18n. Dashboard con `thingiverse/`, `upload/`, `ordenes/`. | Referencia de pantallas y flujo; reescribir en TS. |
| `JIR3D-NEXT` | Intento Next.js + TS (pages, store, interfaces, `thingsThunk.ts`). Incompleto. | Solo ideas/tipos. |
| `JIR3D-OCTOPRINT` | Dockerfile sobre `octoprint/octoprint` + plugin PSUControl + montaje del plugin. | Referencia de infraestructura. |
| `JIR3D-OCTOPRINT-SCRIPT` | Plugin Python `octoprint_jir3d` (~700 líneas, `__init__.py`). | Sí, es la pieza clave (ver abajo). |
| `JIR3D-MYSQL`, `JIR3D-ADMINER`, `JIR3D-WEBSERVER` | Docker de BD, Adminer, nginx. | No; el monorepo ya tiene sus migraciones. |
| `jir3d-back-end` (repo aparte) | Vacío. | — |

### Cómo funciona hoy la impresión (modelo *pull*)

1. El plugin corre dentro de OctoPrint y, cada ~2 s en un hilo, hace `GET {jir3dAPI}/impresoras/{nombre}`.
2. Lee la impresora local por la API REST de OctoPrint (`localhost:5000/api/connection`, `/printer`, `/job`, `/printer/command`, `/plugin/psucontrol`) y envía su estado a `POST {jir3dAPI}/broadcast/{nombre}`.
3. El backend responde con un `comando` (ej. `imprimir`) y `lastPrint`; lo limpia en BD y emite el estado por Socket.IO (`create-something`) al frontend.
4. Para imprimir, el plugin descarga GCODE/scripts de `{jir3dAPI}/files/...` y `{jir3dAPI}/files/repositorio/{lastPrint}/{nombre}` y lo manda a OctoPrint. También maneja nivelación, cancelación y encendido/apagado (PSU).
5. Thingiverse se consultaba **desde el frontend** (`api.thingiverse.com/search/...&access_token=...`).

Modelo `impresora`: `iid, nombre, isActive, estado, price, nozzleTemp, bedTemp, bedParam, lastSeen, comando, lastPrint, lastAction`.

El modelo *pull* es bueno: la impresora (detrás de NAT) sale hacia la API, no hace falta abrir puertos. Conviene conservarlo.

## Problemas a no heredar

- **Credenciales en repos** (ver sección siguiente).
- Tokens de Thingiverse expuestos al navegador (frontend). Deben vivir solo en el backend, que hace de proxy/caché.
- Estado y comandos como strings libres (`comando: "imprimir"`), polling sin contrato, `apikey` de OctoPrint usada también como `Bearer` hacia la API propia.
- JS sin tipos, Sequelize con `sync`, un solo `__init__.py` con lógica, polling y cliente HTTP mezclados; código comentado y archivo duplicado (`__init__ copy.py`).
- Sin autenticación por impresora (cualquiera que conozca el nombre puede consultar/ordenar).

## Dónde va OctoPrint (servidor externo, Python)

Son dos cosas distintas:

1. **El plugin** (código tuyo, Python): vive en el monorepo en [apps/3dprinting/octoprint-plugin](../../apps/3dprinting/octoprint-plugin). Está acoplado al contrato de la API, así que versionarlos juntos evita desincronía. Se empaqueta y se instala con `pip` en OctoPrint; no participa en los workspaces de npm.
2. **El servidor OctoPrint** (software de terceros en la Raspberry/PC): no se versiona; solo se documenta su despliegue (imagen `octoprint/octoprint`, plugin PSUControl, variables). Si se quiere reproducible, una carpeta `apps/3dprinting/infra/octoprint/` con Dockerfile/compose sin secretos.

Alternativa: dejar el plugin en su repo y traerlo como submódulo. No lo recomiendo: duplica el flujo de trabajo y el contrato cambiaría en dos repos.

## Arquitectura objetivo

- Identidad/accesos: reutilizar el backend principal y `packages/user-management` / `application-management`. Cada impresora podría autenticarse con una **API key de app con scopes** (ej. `3dprinting:write:printers`), en vez de un nombre en la URL.
- Backend 3dprinting (TS estricto, mismo `tsconfig` que [backend/tsconfig.json](../../backend/tsconfig.json)): módulos `thingiverse` (proxy/caché), `printers`, `jobs` (cola de impresión con estados tipados), `octoprint` (contrato del plugin).
- Contrato tipado compartido (esquemas/OpenAPI) y estados como uniones: `type PrinterCommand = 'print' | 'cancel' | 'level' | 'psu_on' | 'psu_off'`.
- Estado en vivo al frontend: SSE o WebSocket.
- Frontend: Vite + React + TS (decisión pendiente).

## Orden sugerido de migración

1. Contrato de API + modelo `printers` y `jobs` (migraciones SQL como en `backend/migrations`).
2. Proxy de Thingiverse en el backend + pantalla de búsqueda.
3. Endpoints para el plugin (estado, siguiente comando, descarga de GCODE) con auth por API key.
4. Reescribir el plugin separando cliente OctoPrint, polling y cliente de la API.
5. Cola de impresión, estado en vivo y flujo de órdenes/carrito si sigue aplicando.

## Seguridad: acción pendiente tuya

En `JIR3D` y submódulos hay secretos en texto plano. Aunque los repos son privados, conviene **rotarlos** y no migrarlos:

- Contraseñas de MySQL y usuario en `README.MD` y `docker-compose.dev.yml` de JIR3D.
- Client secret y tokens de Thingiverse en `next.config.js` de `JIR3D-NEXT` (además van al bundle del navegador).
- Un `.env` versionado en la raíz de JIR3D, y `src/data/credentials.js` en `JIR3D-REACT`.
- Un correo personal y una IP de servidor en el README de JIR3D.

No copié ninguno de estos valores al monorepo.

## Decisiones (2026-10-30)

- **Frontend:** Vite + React + TypeScript para apps nuevas. `apps/catalog/frontend` hoy es `react-scripts` (CRA) con JS/JSX, así que *no* es el mismo esquema; CRA está descontinuado. Catalog se migra después, sin prisa.
- **Auth de impresoras:** API key con scopes del sistema de apps (ej. `3dprinting:write:printers`), una key por impresora, revocable. Reutiliza lo que ya existe en `api_keys`.
- **Docker:** fuera de alcance por ahora. Los archivos de JIR3D (`docker-compose*.yml`, Dockerfiles, nginx, certbot) son solo referencia; se reaprende desde cero cuando toque, en una nota propia (`notas_docker.md`).
- **Foundation primero:** TypeScript estricto, el backend principal y el contrato de API van antes que sockets o frontend.

## Tiempo real (sockets): referencia de JIR3D

Cómo era (en `JIR3D-NODE`, `src/js/sockets/`):

- El plugin hace `POST /broadcast/{impresora}` con el estado de OctoPrint.
- El backend, si la impresora está activa, hace `io.emit('create-something', { ...estado, nombre })` a **todos** los clientes.
- Los clientes se registran con el evento `jir3dUserConnected` (guardaba `socketId` y `lastConnection` en el usuario).

Lecciones para la versión nueva (sin implementarlo aún):

- Flujo `plugin → HTTP → backend → socket → navegador`: el plugin sigue usando HTTP (sale a la red, sin puertos abiertos); el socket es solo backend → navegador.
- Eventos tipados y con nombre real (`printer:status`), no `create-something`.
- Emitir por *rooms* (`printer:{id}`) y solo a usuarios con permiso, no `io.emit` global.
- Autenticar el socket con el JWT al conectar.
- Como el flujo es de una sola dirección, **SSE** también sirve y es más simple; Socket.IO tiene sentido si luego hay envío de comandos desde el navegador. Decidir al llegar a ese punto.

## Referencia física y plugin (2026-10-30)

- Copia de JIR3D en [_reference/jir3d/](../../apps/3dprinting/_reference/README.md) (solo lectura, secretos redactados, sin ADMINER).
- Plugin hello world: [octoprint-plugin/](../../apps/3dprinting/octoprint-plugin/README.md).
- Docker: [notas_docker.md](./notas_docker.md).

### Auditoría de secretos de `_reference/jir3d` (2026-10-30)

Resumen de lo hecho al importar JIR3D:

1. Clonado por SSH (clave `ed25519` nueva en GitHub; ADMINER omitido porque no se necesita).
2. Copia con `rsync` excluyendo `.git`, `node_modules`, builds, `.env*`, `*.sql`, `*.pem`, `*.key`, ADMINER.
3. Escaneo por patrones **y revisión manual** de configs (compose, nginx, Dockerfiles, scripts, README, `next.config.js`).
4. Redactado en la copia (`REDACTED*`): tokens de Thingiverse, `CLIENT_ID` y `CLIENT_SECRET` de Thingiverse (el escaneo por patrones no los detectó; los encontró la revisión manual), contraseña y usuario de MySQL, `examplepass`, IP del servidor y remotos SSH de cPanel.
5. Submódulo anidado `OCTOPRINT/OctoPrint-Jir3d` (el plugin real, repo `JIR3D-OCTOPRINT-SCRIPT`) no se había descargado; se inicializó y se copió. Sin secretos embebidos (la API key se lee de los ajustes del plugin).

Quedan a propósito (no son secretos): dominios `*.jir3d.com`, IPs privadas `172.28.x.x`, rutas `/home/ubuntu`, correo público en configs de certbot.

**Acción tuya**: rotar en Thingiverse el token, `CLIENT_SECRET` y app token; cambiar la contraseña de MySQL de producción; asumir expuesta la IP/usuario del servidor. Siguen en el historial de JIR3D.

Lección: el escaneo por patrones no basta; revisar a mano cualquier `*.config.js`, `*.env*` y compose.
