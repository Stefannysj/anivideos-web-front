const CSRF_HEADER = 'X-CSRF-Token';
const CSRF_PATTERN = /^[a-f0-9]{64}$/;
let csrfToken: string | null = null;

function isUnsafeMethod(method: string): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

/** Keeps the CSRF token only in memory. The session credential itself remains HttpOnly. */
export function captureSecurityHeaders(response: Response): void {
  const received = response.headers.get(CSRF_HEADER);
  if (received && CSRF_PATTERN.test(received)) csrfToken = received;
}

export function clearCsrfToken(): void {
  csrfToken = null;
}

/** Shared fetch policy: safe redirects, bounded credentials, public GET caching, and CSRF on writes. */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (isUnsafeMethod(method) && csrfToken) headers.set(CSRF_HEADER, csrfToken);

  const credentials = init.credentials ?? 'include';
  const response = await fetch(input, {
    ...init,
    method,
    headers,
    credentials,
    // Public GET metadata can use server ETag/max-age; authenticated traffic remains uncached.
    cache: init.cache ?? (method === 'GET' && credentials === 'omit' ? 'default' : 'no-store'),
    redirect: 'error',
    referrerPolicy: 'same-origin',
  });
  captureSecurityHeaders(response);
  return response;
}

/** Refuses HTML or other unexpected payloads before model parsers see network data. */
export async function readJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.startsWith('application/json')) {
    throw new Error('La API devolvió un formato de respuesta inesperado.');
  }
  return response.json();
}
