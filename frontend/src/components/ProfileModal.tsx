import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { validateProfile, profileInitials } from '../models/profile.js';
import type { ProfileUpdatePayload, ProfileValidationErrors } from '../models/profile.js';
import { ProfileRequestError } from '../services/profile.service.js';
import { Icon } from './Icon.js';

interface ProfileModalProps {
  onClose: () => void;
}

function formatMemberSince(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(date);
}

/** Perfil editable respaldado por la sesión HttpOnly; React renderiza los campos como texto, sin inyectar HTML. */
export function ProfileModal({ onClose }: ProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape' && !busy) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [busy, onClose]);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username);
    setEmail(user.email);
    setDisplayName(user.displayName ?? '');
    setBio(user.bio ?? '');
  }, [user]);

  const identityChanged = useMemo(() => {
    if (!user) return false;
    return username.trim().toLocaleLowerCase() !== user.username.toLocaleLowerCase()
      || email.trim().toLocaleLowerCase() !== user.email.toLocaleLowerCase();
  }, [email, user, username]);

  if (!user) return null;

  const initials = profileInitials(user.displayName, user.username);
  const visibleName = user.displayName || user.username;

  function resetForm(): void {
    setUsername(user.username);
    setEmail(user.email);
    setDisplayName(user.displayName ?? '');
    setBio(user.bio ?? '');
    setCurrentPassword('');
    setErrors({});
    setRequestError(null);
    setSaved(false);
  }

  function cancelEdit(): void {
    resetForm();
    setEditing(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSaved(false);
    setRequestError(null);
    const nextErrors = validateProfile({ username, email, displayName, bio, currentPassword, identityChanged });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: ProfileUpdatePayload = {};
    if (username.trim() !== user.username) payload.username = username.trim();
    if (email.trim().toLocaleLowerCase() !== user.email.toLocaleLowerCase()) payload.email = email.trim();
    if (displayName.trim() !== (user.displayName ?? '')) payload.displayName = displayName.trim() || null;
    if (bio.trim() !== (user.bio ?? '')) payload.bio = bio.trim() || null;
    if (identityChanged) payload.currentPassword = currentPassword;

    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }

    setBusy(true);
    try {
      await updateProfile(payload);
      setCurrentPassword('');
      setErrors({});
      setEditing(false);
      setSaved(true);
    } catch (error) {
      if (error instanceof ProfileRequestError) {
        setRequestError(error.details.message);
      } else {
        setRequestError('No fue posible guardar el perfil.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="profile-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section className="profile-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <button className="profile-modal__close" type="button" aria-label="Cerrar perfil" disabled={busy} onClick={onClose}>
          <Icon name="close" size={20} />
        </button>

        <header className="profile-hero">
          <div className="profile-avatar" aria-hidden="true">{initials}</div>
          <div className="profile-hero__text">
            <p className="eyebrow">Mi perfil</p>
            <h1 id="profile-title">{visibleName}</h1>
            <p>@{user.username} · Miembro desde {formatMemberSince(user.createdAt)}</p>
          </div>
        </header>

        {!editing ? (
          <div className="profile-view">
            {saved && <p className="profile-success" role="status">Perfil actualizado correctamente.</p>}
            <div className="profile-info-grid">
              <div><span>Nombre visible</span><strong>{user.displayName || 'Sin configurar'}</strong></div>
              <div><span>Usuario</span><strong>@{user.username}</strong></div>
              <div className="profile-info-grid__wide"><span>Correo</span><strong>{user.email}</strong></div>
              <div className="profile-info-grid__wide"><span>Biografía</span><p>{user.bio || 'Todavía no agregaste una biografía.'}</p></div>
            </div>
            <div className="profile-actions">
              <button className="button button--primary" type="button" onClick={() => { setSaved(false); setEditing(true); }}>Editar perfil</button>
              <button className="button button--secondary" type="button" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        ) : (
          <form className="profile-form" onSubmit={(event) => void submit(event)} noValidate>
            <label className="auth-field">
              <span>Nombre visible</span>
              <input value={displayName} maxLength={60} disabled={busy} autoComplete="name" onChange={(event) => setDisplayName(event.target.value)} />
              <small>{displayName.length}/60</small>
              {errors.displayName && <em className="profile-field-error">{errors.displayName}</em>}
            </label>

            <label className="auth-field">
              <span>Usuario</span>
              <input value={username} maxLength={30} disabled={busy} autoComplete="username" onChange={(event) => setUsername(event.target.value)} />
              {errors.username && <em className="profile-field-error">{errors.username}</em>}
            </label>

            <label className="auth-field">
              <span>Correo electrónico</span>
              <input type="email" value={email} maxLength={254} disabled={busy} autoComplete="email" onChange={(event) => setEmail(event.target.value)} />
              {errors.email && <em className="profile-field-error">{errors.email}</em>}
            </label>

            <label className="auth-field profile-form__wide">
              <span>Biografía</span>
              <textarea value={bio} maxLength={280} disabled={busy} rows={4} onChange={(event) => setBio(event.target.value)} />
              <small>{bio.length}/280</small>
              {errors.bio && <em className="profile-field-error">{errors.bio}</em>}
            </label>

            {identityChanged && (
              <label className="auth-field profile-form__wide">
                <span>Contraseña actual</span>
                <input type="password" value={currentPassword} maxLength={128} disabled={busy} autoComplete="current-password" onChange={(event) => setCurrentPassword(event.target.value)} />
                <small>Se solicita únicamente para cambiar tu usuario o correo.</small>
                {errors.currentPassword && <em className="profile-field-error">{errors.currentPassword}</em>}
              </label>
            )}

            {requestError && <p className="auth-error profile-form__wide" role="alert">{requestError}</p>}

            <div className="profile-actions profile-form__wide">
              <button className="button button--primary" type="submit" disabled={busy}>{busy ? 'Guardando...' : 'Guardar cambios'}</button>
              <button className="button button--secondary" type="button" disabled={busy} onClick={cancelEdit}>Cancelar</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
