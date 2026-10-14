import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import type { AuthUser, LoginPayload, RegisterPayload } from '../models/auth.js';
import type { ProfileUpdatePayload } from '../models/profile.js';
import { getCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../services/auth.service.js';
import { updateProfile as updateProfileRequest } from '../services/profile.service.js';

type AuthStatus = 'checking' | 'anonymous' | 'authenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_BOOTSTRAP_TIMEOUT_MS = 5_000;

/**
 * Restores the HttpOnly session without allowing an unavailable backend to lock
 * the whole account UI in the "checking" state.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [user, setUser] = useState<AuthUser | null>(null);
  const bootstrapController = useRef<AbortController | null>(null);
  const baseUrl = useMemo(
    () => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    bootstrapController.current = controller;
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), SESSION_BOOTSTRAP_TIMEOUT_MS);

    void getCurrentUser(baseUrl, controller.signal)
      .then((response) => {
        if (!active || controller.signal.aborted) return;
        setUser(response?.user ?? null);
        setStatus(response ? 'authenticated' : 'anonymous');
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus('anonymous');
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (bootstrapController.current === controller) bootstrapController.current = null;
      });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
      if (bootstrapController.current === controller) bootstrapController.current = null;
    };
  }, [baseUrl]);

  const cancelBootstrap = useCallback(() => {
    bootstrapController.current?.abort();
    bootstrapController.current = null;
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    cancelBootstrap();
    const response = await loginRequest(baseUrl, payload);
    setUser(response.user);
    setStatus('authenticated');
  }, [baseUrl, cancelBootstrap]);

  const register = useCallback(async (payload: RegisterPayload) => {
    cancelBootstrap();
    const response = await registerRequest(baseUrl, payload);
    setUser(response.user);
    setStatus('authenticated');
  }, [baseUrl, cancelBootstrap]);

  const updateProfile = useCallback(async (payload: ProfileUpdatePayload) => {
    const response = await updateProfileRequest(baseUrl, payload);
    setUser(response.user);
    setStatus('authenticated');
  }, [baseUrl]);

  const logout = useCallback(async () => {
    cancelBootstrap();
    try {
      await logoutRequest(baseUrl);
    } finally {
      setUser(null);
      setStatus('anonymous');
    }
  }, [baseUrl, cancelBootstrap]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, register, logout, updateProfile }),
    [status, user, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  return context;
}
