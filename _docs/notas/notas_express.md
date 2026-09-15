# Notas Express (Rutas y Mapeo)

## Idea base

- `express()` crea una instancia de aplicacion.
- `Router()` crea una instancia de router.
- `app.use('/x', router)` monta un router bajo un prefijo.
- `router.get(...)`, `router.post(...)`, etc. registran handlers dentro del router.
- `export default router` exporta el router ya configurado.

## Como leer `app.use('/x', router)`

- `'/x'` es el prefijo de montaje.
- Express usa ese prefijo para decidir si delega la request al router.
- Si la ruta coincide, Express entrega al router solo la parte restante.
- Ejemplo:
  - `app.use('/api/users', userRoutes)`
  - request real: `GET /api/users/123`
  - el router ve el path restante: `/:userId`

## Orden de procesamiento

- Primero se ejecutan los middleware montados antes del router.
- Luego Express intenta hacer match de ruta dentro del router.
- Si la ruta coincide, se ejecuta la cadena de middleware del endpoint.
- Al final se ejecuta el handler principal del controller.

## Terminologia util para entrevistas

- `application instance`: el objeto devuelto por `express()`.
- `router instance`: el objeto devuelto por `Router()`.
- `mounting`: registrar un router bajo un prefijo con `app.use('/x', router)`.
- `middleware chain`: secuencia de funciones que procesan la request.
- `route handler`: funcion final que responde la request.

## Ejemplo mental

```ts
const app = express();
const router = Router();

router.get('/:userId', getUserById);
app.use('/api/users', router);
```

Lectura:

- `app` recibe todas las requests.
- `'/api/users'` filtra el grupo de requests que van al router.
- `router` decide si `/:userId` coincide.
- `getUserById` responde al final.

## Regla practica

- `app` organiza la aplicacion completa.
- `router` organiza un subarbol de rutas.
- `app.use` conecta ambos.
