import { parseAuthApiError, parseAuthResponse } from '../models/auth.js';
import type { AuthApiError, AuthResponse } from '../models/auth.js';
import type { ProfileUpdatePayload } from '../models/profile.js';
import { apiFetch, readJson } from './http.js';

export class ProfileRequestError extends Error {
  readonly details: AuthApiError;

  constructor(details: AuthApiError) {
    super(details.message);
    this.name = 'ProfileRequestError';
    this.details = details;
  }
}

export async function updateProfile(baseUrl: string, payload: ProfileUpdatePayload): Promise<AuthResponse> {
  const response = await apiFetch(`${baseUrl}/profile`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data: unknown = await readJson(response).catch(() => null);
  if (!response.ok) {
    throw new ProfileRequestError(parseAuthApiError(data, 'No fue posible actualizar el perfil.'));
  }
  return parseAuthResponse(data);
}
