import { parseHealthResponse } from '../models/health.js';
import type { HealthResponse } from '../models/health.js';

/** Comprueba la API con tiempo limite y cancelacion al desmontar la interfaz. */
export async function getHealth(baseUrl: string, signal?: AbortSignal): Promise<HealthResponse> {
  const controller = new AbortController();
  const cancel = (): void => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) controller.abort();
  const timeout = setTimeout(cancel, 8_000);

  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('No fue posible consultar el backend.');
    const payload: unknown = await response.json();
    return parseHealthResponse(payload);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}
