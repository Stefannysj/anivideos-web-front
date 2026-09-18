import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { validateEmail, validatePassword, validateUsername } from '../models/auth.js';
import { AuthRequestError } from '../services/auth.service.js';
import { useAuth } from '../context/AuthContext.js';
import { Brand } from './Brand.js';
import { Icon } from './Icon.js';

export type AuthMode = 'login' | 'register';

interface AuthModalProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}

/** Accessible login/register dialog. The backend owns credentials and the browser only receives an HttpOnly session cookie. */
export function AuthModal({ mode, onModeChange, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstInput.current?.focus();
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape' && !submitting) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, submitting]);

  function switchMode(nextMode: AuthMode): void {
    setError(null);
    setPassword('');
    setConfirmPassword('');
    onModeChange(nextMode);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);

    if (mode === 'register') {
      const usernameError = validateUsername(username);
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);
      if (usernameError || emailError || passwordError) {
        setError(usernameError ?? emailError ?? passwordError);
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    } else if (!identifier.trim() || !password) {
      setError('Completa tus credenciales.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ identifier: identifier.trim(), password });
      } else {
        await register({ username: username.trim(), email: email.trim(), password });
      }
      onClose();
    } catch (cause) {
      setError(cause instanceof AuthRequestError ? cause.message : 'No fue posible completar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-modal" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !submitting) onClose();
    }}>
      <section className="auth-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-modal__close" type="button" aria-label="Cerrar" disabled={submitting} onClick={onClose}>
          <Icon name="close" size={21} />
        </button>

        <div className="auth-modal__brand"><Brand compact /></div>
        <p className="eyebrow">Cuenta AniVideos</p>
        <h1 id="auth-title">{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h1>
        <p className="auth-modal__lead">
          {mode === 'login'
            ? 'Ingresa con tu usuario o correo para continuar.'
            : 'Tu contraseña se protege en el backend y nunca se almacena en texto plano.'}
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Autenticación">
          <button className={mode === 'login' ? 'auth-tab auth-tab--active' : 'auth-tab'} type="button" role="tab" aria-selected={mode === 'login'} onClick={() => switchMode('login')}>Ingresar</button>
          <button className={mode === 'register' ? 'auth-tab auth-tab--active' : 'auth-tab'} type="button" role="tab" aria-selected={mode === 'register'} onClick={() => switchMode('register')}>Registrarme</button>
        </div>

        <form className="auth-form" onSubmit={(event) => void submit(event)} noValidate>
          {mode === 'login' ? (
            <label className="auth-field">
              <span>Usuario o correo</span>
              <input ref={firstInput} value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" maxLength={254} disabled={submitting} />
            </label>
          ) : (
            <>
              <label className="auth-field">
                <span>Usuario</span>
                <input ref={firstInput} value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" minLength={3} maxLength={30} disabled={submitting} />
                <small>3-30 caracteres. Letras, números, punto, guion o guion bajo.</small>
              </label>
              <label className="auth-field">
                <span>Correo electrónico</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" maxLength={254} disabled={submitting} />
              </label>
            </>
          )}

          <label className="auth-field">
            <span>Contraseña</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'register' ? 10 : undefined} maxLength={128} disabled={submitting} />
            {mode === 'register' && <small>Mínimo 10 caracteres, con al menos una letra y un número.</small>}
          </label>

          {mode === 'register' && (
            <label className="auth-field">
              <span>Confirmar contraseña</span>
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={10} maxLength={128} disabled={submitting} />
            </label>
          )}

          {error && <div className="auth-error" role="alert">{error}</div>}

          <button className="button button--primary auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-modal__security-note">Sesión mediante cookie HttpOnly. AniVideos no guarda el token de sesión en localStorage.</p>
      </section>
    </div>
  );
}
