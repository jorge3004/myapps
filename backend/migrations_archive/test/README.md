# Scripts de Prueba Archivados

Esta carpeta conserva un laboratorio minimo para practicar decision manual de transaccion.

## Archivo disponible

- `007_seed_dev_manual_decision.sql`: replica el seed de desarrollo sin `COMMIT` final.

## Uso recomendado

```sql
SELECT DATABASE();
SOURCE /home/jorge/myapps/backend/migrations_archive/test/007_seed_dev_manual_decision.sql;
-- revisar resultados en la misma sesion
COMMIT;
-- o
ROLLBACK;
```

## Nota

- El script deja la decision final en consola para aprendizaje o validacion manual.
- Debes ejecutar `COMMIT` o `ROLLBACK` en la misma sesion de `mysql`.
