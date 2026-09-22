import { validateEmail, validateUsername } from './auth.js';

export interface ProfileUpdatePayload {
  username?: string;
  email?: string;
  displayName?: string | null;
  bio?: string | null;
  currentPassword?: string;
}

export interface ProfileValidationInput {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  currentPassword: string;
  identityChanged: boolean;
}

export interface ProfileValidationErrors {
  username?: string;
  email?: string;
  displayName?: string;
  bio?: string;
  currentPassword?: string;
}

export function validateProfile(input: ProfileValidationInput): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};
  const usernameError = validateUsername(input.username);
  const emailError = validateEmail(input.email);
  if (usernameError) errors.username = usernameError;
  if (emailError) errors.email = emailError;
  if (input.displayName.trim().length > 60) errors.displayName = 'El nombre visible admite hasta 60 caracteres.';
  if (input.bio.trim().length > 280) errors.bio = 'La biografía admite hasta 280 caracteres.';
  if (input.identityChanged && !input.currentPassword) errors.currentPassword = 'Ingresa tu contraseña actual para cambiar usuario o correo.';
  return errors;
}

export function profileInitials(displayName: string | null, username: string): string {
  const source = (displayName?.trim() || username.trim()).replace(/[_\-.]+/g, ' ');
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
