/** Admite el proxy local o una API HTTPS, sin incluir secretos en el navegador. */
export function resolveApiBaseUrl(value: string | undefined, production: boolean): string {
  const candidate = value?.trim() || '/api';
  if (candidate === '/api') return candidate;

  const url = new URL(candidate);
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  const allowedProtocol = url.protocol === 'https:' ||
    (!production && isLocal && url.protocol === 'http:');

  if (!allowedProtocol || url.username || url.password || url.search || url.hash) {
    throw new Error('VITE_API_BASE_URL debe ser /api o una URL HTTPS sin credenciales.');
  }
  return url.toString().replace(/\/$/, '');
}
