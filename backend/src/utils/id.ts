/**
 * simpleId - Generador de IDs únicos y cortos para desarrollo y pruebas.
 *
 * NOTA IMPORTANTE: Para producción, migrar a una solución robusta como nanoid (https://github.com/ai/nanoid)
 * para asegurar unicidad global y seguridad criptográfica.
 *
 * Esta función es solo para ambientes de desarrollo/local/testing.
 */
export function simpleId(length = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + Date.now().toString(36);
}
