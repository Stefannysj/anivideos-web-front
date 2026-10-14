import { t } from '../i18n/i18n.js';
import { parseAuthApiError, parseAuthResponse } from '../models/auth.js';
import type { AuthApiError, AuthResponse, LoginPayload, RegisterPayload } from '../models/auth.js';
import { apiFetch, clearCsrfToken, readJson } from './http.js';

const AUTH_TIMEOUT_MS = 10_000;

export class AuthRequestError extends Error {
  readonly details: AuthApiError;

  constructor(details: AuthApiError) {
    super(details.message);
    this.name = 'AuthRequestError';
    this.details = details;
  }
}

async function authRequest(
  baseUrl: string,
  path: string,
  init: RequestInit,
  fallback: string,
): Promise<AuthResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

  try {
    const response = await apiFetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
    const payload: unknown = await readJson(response).catch(() => null);
    if (!response.ok) throw new AuthRequestError(parseAuthApiError(payload, fallback));
    return parseAuthResponse(payload);
  } catch (cause) {
    if (cause instanceof AuthRequestError) throw cause;
    throw new AuthRequestError({
      code: 'BACKEND_UNAVAILABLE',
      message: `${fallback} ${t('api.help')}`,
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

export function register(baseUrl: string, payload: RegisterPayload): Promise<AuthResponse> {
  return authRequest(
    baseUrl,
    '/auth/register',
    { method: 'POST', body: JSON.stringify(payload) },
    t('auth.requestFailed'),
  );
}

export function login(baseUrl: string, payload: LoginPayload): Promise<AuthResponse> {
  return authRequest(
    baseUrl,
    '/auth/login',
    { method: 'POST', body: JSON.stringify(payload) },
    t('auth.requestFailed'),
  );
}

export async function getCurrentUser(baseUrl: string, signal?: AbortSignal): Promise<AuthResponse | null> {
  const response = await apiFetch(`${baseUrl}/auth/me`, {
    method: 'GET',
    signal,
  });
  if (response.status === 401) {
    clearCsrfToken();
    return null;
  }
  const payload: unknown = await readJson(response).catch(() => null);
  if (!response.ok) throw new AuthRequestError(parseAuthApiError(payload, t('auth.requestFailed')));
  return parseAuthResponse(payload);
}

export async function logout(baseUrl: string): Promise<void> {
  const response = await apiFetch(`${baseUrl}/auth/logout`, { method: 'POST' });
  if (!response.ok) {
    const payload: unknown = await readJson(response).catch(() => null);
    if (response.status === 401) clearCsrfToken();
    throw new AuthRequestError(parseAuthApiError(payload, t('auth.requestFailed')));
  }
  clearCsrfToken();
}
