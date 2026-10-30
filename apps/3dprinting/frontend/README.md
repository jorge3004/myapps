# 3DPrinting – Frontend

Vacío a propósito. Pendiente de decidir el stack antes de crear el proyecto (recomendado: Vite + React + TypeScript, igual que el resto del monorepo en TS).

Pantallas objetivo: explorar modelos (Thingiverse), detalle del modelo, cola de impresión y estado de impresoras.

Ver el plan completo en [notas_3dprinting.md](../../../_docs/notas/notas_3dprinting.md).

## Estado (2026-10-30)

Scaffold Vite + React + TypeScript estricto (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).

- `npm run dev` → http://localhost:5174 (proxy `/api` → backend en `:4100`)
- `npm run build` → typecheck + build
