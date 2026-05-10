// Valida y normaliza rutas para el dashboard
// Permite:
//   /dashboard
//   /dashboard/users
//   /dashboard/catalog
//   /dashboard/catalog/:id (id numérico)
// Puedes agregar más rutas válidas en la lista o patrones
export function validateDashboardRoute(route) {
    if (!route || typeof route !== 'string') return '/dashboard';
    let r = route.startsWith('/') ? route : '/' + route;
    // Rutas fijas permitidas
    const allowed = ['/dashboard', '/dashboard/users', '/dashboard/catalog'];
    if (allowed.includes(r)) return r;
    // Rutas dinámicas: /dashboard/catalog/:id (id numérico)
    const catalogIdMatch = r.match(/^\/dashboard\/catalog\/(\d+)$/);
    if (catalogIdMatch) return r;
    // Si no es válida, regresa /dashboard
    return '/dashboard';
}
