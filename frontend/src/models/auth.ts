export interface AuthUser {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface AuthFieldError {
  field: string;
  message: string;
}

export interface AuthApiError {
  code: string;
  message: string;
  fields?: AuthFieldError[];
}

export function parseAuthResponse(payload: unknown): AuthResponse {
  if (!isRecord(payload) || !isRecord(payload.user)) throw new Error('Respuesta de autenticación inválida.');
  const user = payload.user;
  const id = user.id;
  const username = user.username;
  const email = user.email;
  const rawAvatarUrl = user.avatarUrl;
  const createdAt = user.createdAt;
  if (typeof id !== 'number' || typeof username !== 'string' || typeof email !== 'string' || typeof createdAt !== 'string') {
    throw new Error('Usuario inválido en respuesta de autenticación.');
  }
  if (rawAvatarUrl === null) return { user: { id, username, email, avatarUrl: null, createdAt } };
  if (typeof rawAvatarUrl === 'string') return { user: { id, username, email, avatarUrl: rawAvatarUrl, createdAt } };
  throw new Error('Usuario inválido en respuesta de autenticación.');
}

export function validateUsername(value: string): string | null {
  return /^[A-Za-z0-9_.-]{3,30}$/.test(value.trim())
    ? null
    : 'Usa entre 3 y 30 caracteres: letras, números, punto, guion o guion bajo.';
}

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (email.length < 5 || email.length > 254) return 'Ingresa un correo electrónico válido.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : 'Ingresa un correo electrónico válido.';
}

export function validatePassword(value: string): string | null {
  if (value.length < 10 || value.length > 128) return 'La contraseña debe tener entre 10 y 128 caracteres.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Incluye al menos una letra y un número.';
  return null;
}

export function parseAuthApiError(payload: unknown, fallback: string): AuthApiError {
  if (!isRecord(payload)) return { code: 'REQUEST_FAILED', message: fallback };
  if (isRecord(payload.error)) {
    const code = typeof payload.error.code === 'string' ? payload.error.code : 'REQUEST_FAILED';
    const message = typeof payload.error.message === 'string' ? payload.error.message : fallback;
    const fields = Array.isArray(payload.error.fields)
      ? payload.error.fields.filter(isFieldError).map((item) => ({ field: item.field, message: item.message }))
      : undefined;
    return { code, message, fields };
  }
  if (typeof payload.detail === 'string') return { code: 'REQUEST_FAILED', message: payload.detail };
  return { code: 'REQUEST_FAILED', message: fallback };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFieldError(value: unknown): value is { field: string; message: string } {
  return isRecord(value) && typeof value.field === 'string' && typeof value.message === 'string';
}
