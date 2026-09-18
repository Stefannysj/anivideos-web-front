import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import type { AuthUser, LoginPayload, RegisterPayload } from '../models/auth.js';
import { getCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../services/auth.service.js';

type AuthStatus = 'checking' | 'anonymous' | 'authenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Maintains the current session only from the backend HttpOnly cookie; no token is stored in JavaScript. */
export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [user, setUser] = useState<AuthUser | null>(null);
  const baseUrl = useMemo(
    () => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    getCurrentUser(baseUrl, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        setUser(response?.user ?? null);
        setStatus(response ? 'authenticated' : 'anonymous');
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setUser(null);
          setStatus('anonymous');
        }
      });
    return () => controller.abort();
  }, [baseUrl]);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginRequest(baseUrl, payload);
    setUser(response.user);
    setStatus('authenticated');
  }, [baseUrl]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await registerRequest(baseUrl, payload);
    setUser(response.user);
    setStatus('authenticated');
  }, [baseUrl]);

  const logout = useCallback(async () => {
    await logoutRequest(baseUrl);
    setUser(null);
    setStatus('anonymous');
  }, [baseUrl]);

  const value = useMemo<AuthContextValue>(() => ({ status, user, login, register, logout }), [status, user, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  return context;
}
