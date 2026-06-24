# API Key Revocation Endpoints

Ultima actualizacion: 2026-06-18
Estado: active
Ambito: especializado (reglas de interpretacion API keys)

Relacion con otros documentos:
- Inventario completo de endpoints: [ENDPOINTS_GUIDE.md](../testing/ENDPOINTS_GUIDE.md)
- Historial de cambios: [IMPLEMENTATION_TIMELINE.md](../navigation/IMPLEMENTATION_TIMELINE.md)

**Revocación global de API keys (recomendado):**

- DELETE `/api/apps/apikeys/:apiKey`
  - Revoca la API key en cualquier app donde exista.
  - Uso estándar y robusto para la mayoría de los casos.

**Revocación por app específica (casos avanzados):**

- POST `/api/apps/:appId/apikeys/:apiKey/revoke`
  - Revoca la API key solo en la app indicada.
  - Útil para flujos administrativos o auditoría avanzada.

---

**Notas:**
- No se recomienda exponer rutas directas como `/api/apikeys/:apiKey` para evitar ambigüedad y mantener la estructura RESTful.
- Toda la lógica de revocación está centralizada en el backend principal (`myapps/backend`).
- El backend legacy solo se mantiene para referencia histórica.

Este documento se mantiene separado a proposito para evitar perdida de contexto.
No fusionar su contenido interpretativo dentro de listas generales de endpoints.

**Actualizado:** 2026-05-28
