import { parseHealthResponse } from '../models/health.js';
import type { HealthResponse } from '../models/health.js';
import { apiFetch, readJson } from './http.js';

/** Checks the public health endpoint with a deadline and without session credentials. */
export async function getHealth(baseUrl: string, signal?: AbortSignal): Promise<HealthResponse> {
  const controller = new AbortController();
  const cancel = (): void => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) controller.abort();
  const timeout = setTimeout(cancel, 8_000);

  try {
    const response = await apiFetch(`${baseUrl}/health`, {
      method: 'GET',
      credentials: 'omit',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('No fue posible consultar el backend.');
    const payload: unknown = await readJson(response);
    return parseHealthResponse(payload);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}
