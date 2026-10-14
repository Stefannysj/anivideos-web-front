import { parseHealthResponse } from '../models/health.js';
import type { HealthResponse } from '../models/health.js';
import { apiFetch, readJson } from './http.js';

/** Fast local readiness check. It must never keep the UI in verification mode indefinitely. */
export async function getHealth(baseUrl: string, signal?: AbortSignal): Promise<HealthResponse> {
  const controller = new AbortController();
  const cancel = (): void => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) controller.abort();
  const timeout = window.setTimeout(cancel, 4_000);

  try {
    const response = await apiFetch(`${baseUrl}/health`, {
      method: 'GET',
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Backend unavailable');
    const payload: unknown = await readJson(response);
    return parseHealthResponse(payload);
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}
