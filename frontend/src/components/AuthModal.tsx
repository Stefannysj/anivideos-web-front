import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import { useAuth } from '../context/AuthContext.js';
import { t } from '../i18n/i18n.js';
import { validateEmail, validatePassword, validateUsername } from '../models/auth.js';
import { AuthRequestError } from '../services/auth.service.js';
import { getHealth } from '../services/health.service.js';
import { Brand } from './Brand.js';
import { Icon } from './Icon.js';

export type AuthMode = 'login' | 'register';
type BackendState = 'checking' | 'available' | 'unavailable';

interface Props {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}

export function AuthModal({ mode, onModeChange, onClose }: Props) {
  const { login, register } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [backend, setBackend] = useState<BackendState>('checking');
  const firstInput = useRef<HTMLInputElement>(null);
  const baseUrl = useMemo(() => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD), []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstInput.current?.focus();
    function key(event: KeyboardEvent): void { if (event.key === 'Escape' && !submitting) onClose(); }
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', key);
    };
  }, [onClose, submitting]);

  useEffect(() => {
    const controller = new AbortController();
    setBackend('checking');
    void getHealth(baseUrl, controller.signal)
      .then(() => { if (!controller.signal.aborted) setBackend('available'); })
      .catch(() => { if (!controller.signal.aborted) setBackend('unavailable'); });
    return () => controller.abort();
  }, [baseUrl]);

  function switchMode(next: AuthMode): void {
    setError(null);
    setPassword('');
    setConfirmPassword('');
    onModeChange(next);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);

    if (mode === 'register') {
      const validation = validateUsername(username) ?? validateEmail(email) ?? validatePassword(password);
      if (validation) { setError(validation); return; }
      if (password !== confirmPassword) { setError(t('auth.passwordMismatch')); return; }
    } else if (!identifier.trim() || !password) {
      setError(t('auth.completeCredentials'));
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') await login({ identifier: identifier.trim(), password });
      else await register({ username: username.trim(), email: email.trim(), password });
      onClose();
    } catch (cause) {
      setError(cause instanceof AuthRequestError ? cause.message : t('auth.requestFailed'));
      setBackend('unavailable');
    } finally {
      setSubmitting(false);
    }
  }

  const backendLabel = backend === 'available' ? t('api.available') : backend === 'unavailable' ? t('api.unavailable') : t('api.checking');

  return (
    <div className="auth-modal v18-auth-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) onClose(); }}>
      <section className="auth-modal__dialog v18-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-modal__close" type="button" aria-label={t('auth.close')} disabled={submitting} onClick={onClose}><Icon name="close" size={21} /></button>

        <aside className="v18-auth-visual" aria-hidden="true">
          <div className="v18-auth-visual__orb" />
          <Brand compact />
          <div>
            <p className="eyebrow">AniVideos</p>
            <h2>{t('home.overview.title')}</h2>
            <p>{t('home.overview.body')}</p>
          </div>
          <div className="v18-auth-visual__marks"><span>{t('source.anilist')}</span><span>PostgreSQL</span><span>HttpOnly</span></div>
        </aside>

        <div className="v18-auth-form-panel">
          <div className={`v18-backend-chip v18-backend-chip--${backend}`} role="status" aria-live="polite">
            <span />
            {backendLabel}
          </div>

          <p className="eyebrow">{t('auth.account')}</p>
          <h1 id="auth-title">{mode === 'login' ? t('auth.welcome') : t('auth.create')}</h1>
          <p className="auth-modal__lead">{mode === 'login' ? t('auth.loginLead') : t('auth.registerLead')}</p>

          <div className="auth-tabs" role="tablist" aria-label={t('auth.tabs')}>
            <button className={mode === 'login' ? 'auth-tab auth-tab--active' : 'auth-tab'} type="button" role="tab" aria-selected={mode === 'login'} onClick={() => switchMode('login')}>{t('auth.login')}</button>
            <button className={mode === 'register' ? 'auth-tab auth-tab--active' : 'auth-tab'} type="button" role="tab" aria-selected={mode === 'register'} onClick={() => switchMode('register')}>{t('auth.register')}</button>
          </div>

          <form className="auth-form" onSubmit={(event) => void submit(event)} noValidate>
            {mode === 'login' ? (
              <label className="auth-field"><span>{t('auth.identifier')}</span><input ref={firstInput} value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" maxLength={254} disabled={submitting} /></label>
            ) : (
              <>
                <label className="auth-field"><span>{t('auth.username')}</span><input ref={firstInput} value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" minLength={3} maxLength={30} disabled={submitting} /><small>{t('auth.usernameHelp')}</small></label>
                <label className="auth-field"><span>{t('auth.email')}</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" maxLength={254} disabled={submitting} /></label>
              </>
            )}

            <label className="auth-field"><span>{t('auth.password')}</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'register' ? 10 : undefined} maxLength={128} disabled={submitting} />{mode === 'register' && <small>{t('auth.passwordHelp')}</small>}</label>
            {mode === 'register' && <label className="auth-field"><span>{t('auth.confirmPassword')}</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={10} maxLength={128} disabled={submitting} /></label>}

            {error && <p className="auth-error" role="alert">{error}</p>}
            {backend === 'unavailable' && !error && <p className="v18-auth-help">{t('api.help')}</p>}

            <button className="button button--primary auth-submit" type="submit" disabled={submitting}>{submitting ? t('auth.submitBusy') : mode === 'login' ? t('auth.login') : t('auth.register')}</button>
          </form>
          <p className="auth-modal__security-note">{t('auth.security')}</p>
        </div>
      </section>
    </div>
  );
}
