import { useEffect, useRef, useState } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import type { ConnectionState } from '../models/health.js';
import { getHealth } from '../services/health.service.js';

const labels: Record<ConnectionState['status'], string> = {
  idle: 'Sin comprobar',
  checking: 'Comprobando...',
  available: 'Conexión disponible',
  unavailable: 'Sin conexión',
};

export function ApiStatus() {
  const [state, setState] = useState<ConnectionState>({ status: 'idle' });
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => { request.current?.abort(); }, []);

  async function checkConnection(): Promise<void> {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setState({ status: 'checking' });

    try {
      const baseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD);
      const data = await getHealth(baseUrl, controller.signal);
      if (!controller.signal.aborted) setState({ status: 'available', data });
    } catch {
      if (!controller.signal.aborted) setState({ status: 'unavailable' });
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  return (
    <section className="surface-card" aria-labelledby="backend-title">
      <p className="eyebrow">API independiente</p>
      <h2 id="backend-title">Backend operativo</h2>
      <p>Fastify + TypeScript. Esta comprobación mantiene validado el enlace local entre ambos proyectos.</p>
      <p className={`status status--${state.status}`} role="status" aria-live="polite">
        <span className="status-dot" aria-hidden="true" />
        {labels[state.status]}
      </p>
      {state.status === 'unavailable' && (
        <p className="help">Verifica que el backend esté iniciado en el puerto 3001.</p>
      )}
      <button
        className="button button--primary"
        type="button"
        disabled={state.status === 'checking'}
        onClick={() => { void checkConnection(); }}
      >
        {state.status === 'checking' ? 'Comprobando...' : 'Comprobar conexión'}
      </button>
    </section>
  );
}
