/**
 * Resolves the API URL without exposing secrets.
 *
 * In local Vite development we deliberately use the same-origin `/api` proxy.
 * This keeps HttpOnly cookies/CSRF on one origin and avoids local CORS drift
 * when a stale VITE_API_BASE_URL points directly to port 3001.
 */
export function resolveApiBaseUrl(value: string | undefined, production: boolean): string {
  const candidate = value?.trim() || '/api';
  if (candidate === '/api') return candidate;

  const url = new URL(candidate);
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);

  if (!production && isLocal && url.protocol === 'http:') {
    return '/api';
  }

  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error('VITE_API_BASE_URL debe ser /api o una URL HTTPS sin credenciales.');
  }

  return url.toString().replace(/\/$/, '');
}
