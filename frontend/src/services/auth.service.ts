import { parseAuthApiError, parseAuthResponse } from '../models/auth.js';
import type { AuthApiError, AuthResponse, LoginPayload, RegisterPayload } from '../models/auth.js';
import { apiFetch, clearCsrfToken, readJson } from './http.js';

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
  const response = await apiFetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const payload: unknown = await readJson(response).catch(() => null);
  if (!response.ok) throw new AuthRequestError(parseAuthApiError(payload, fallback));
  return parseAuthResponse(payload);
}

export function register(baseUrl: string, payload: RegisterPayload): Promise<AuthResponse> {
  return authRequest(baseUrl, '/auth/register', { method: 'POST', body: JSON.stringify(payload) }, 'No fue posible crear la cuenta.');
}

export function login(baseUrl: string, payload: LoginPayload): Promise<AuthResponse> {
  return authRequest(baseUrl, '/auth/login', { method: 'POST', body: JSON.stringify(payload) }, 'No fue posible iniciar sesión.');
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
  if (!response.ok) throw new AuthRequestError(parseAuthApiError(payload, 'No fue posible verificar la sesión.'));
  return parseAuthResponse(payload);
}

export async function logout(baseUrl: string): Promise<void> {
  const response = await apiFetch(`${baseUrl}/auth/logout`, { method: 'POST' });
  if (!response.ok) {
    const payload: unknown = await readJson(response).catch(() => null);
    if (response.status === 401) clearCsrfToken();
    throw new AuthRequestError(parseAuthApiError(payload, 'No fue posible cerrar la sesión.'));
  }
  clearCsrfToken();
}
