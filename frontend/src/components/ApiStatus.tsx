import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import { t } from '../i18n/i18n.js';
import type { ConnectionState } from '../models/health.js';
import { getHealth } from '../services/health.service.js';

export function ApiStatus() {
  const [state, setState] = useState<ConnectionState>({ status: 'idle' });
  const request = useRef<AbortController | null>(null);

  const check = useCallback(async () => {
    request.current?.abort();
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
  }, []);

  useEffect(() => {
    void check();
    return () => request.current?.abort();
  }, [check]);

  const label = state.status === 'idle' ? t('api.idle') : state.status === 'checking' ? t('api.checking') : state.status === 'available' ? t('api.available') : t('api.unavailable');

  return (
    <div className="api-status" aria-labelledby="backend-status-title">
      <div><p className="eyebrow">{t('api.eyebrow')}</p><h3 id="backend-status-title">Backend</h3><p>{t('api.description')}</p></div>
      <div className="api-status__controls">
        <p className={`status status--${state.status}`} role="status" aria-live="polite"><span className="status-dot" aria-hidden="true" />{label}</p>
        <button className="button button--secondary" type="button" onClick={() => void check()}>{t('api.check')}</button>
      </div>
      {state.status === 'unavailable' && <p className="api-status__help">{t('api.help')}</p>}
    </div>
  );
}
