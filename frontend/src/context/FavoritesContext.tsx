import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import type { ContentItem } from '../models/content.js';
import { getFavorites, setFavorite } from '../services/favorite.service.js';
import { useAuth } from './AuthContext.js';

type FavoritesStatus = 'idle' | 'loading' | 'ready' | 'error';

interface FavoritesContextValue {
  status: FavoritesStatus;
  items: readonly ContentItem[];
  error: string | null;
  isFavorite: (contentId: string) => boolean;
  isBusy: (contentId: string) => boolean;
  toggleFavorite: (item: ContentItem) => Promise<void>;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/** Keeps the authenticated user's favorite list synchronized with SQLite through the Python API. */
export function FavoritesProvider({ children }: PropsWithChildren) {
  const { status: authStatus, user } = useAuth();
  const [status, setStatus] = useState<FavoritesStatus>('idle');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const baseUrl = useMemo(
    () => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD),
    [],
  );

  const load = useCallback(async (signal?: AbortSignal) => {
    if (authStatus !== 'authenticated' || !user) {
      setItems([]);
      setError(null);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    setError(null);
    try {
      const favorites = await getFavorites(baseUrl, signal);
      if (signal?.aborted) return;
      setItems(favorites);
      setStatus('ready');
    } catch (requestError) {
      if (signal?.aborted) return;
      setError(requestError instanceof Error ? requestError.message : 'No fue posible cargar tus favoritos.');
      setStatus('error');
    }
  }, [authStatus, baseUrl, user]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, user?.id]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const isFavorite = useCallback(
    (contentId: string) => items.some((item) => item.id === contentId),
    [items],
  );

  const isBusy = useCallback((contentId: string) => busyIds.has(contentId), [busyIds]);

  const toggleFavorite = useCallback(async (item: ContentItem) => {
    if (authStatus !== 'authenticated' || !user || busyIds.has(item.id)) return;

    const wasFavorite = items.some((favorite) => favorite.id === item.id);
    const nextFavorite = !wasFavorite;
    setError(null);
    setBusyIds((current) => new Set(current).add(item.id));
    setItems((current) => nextFavorite
      ? [item, ...current.filter((favorite) => favorite.id !== item.id)]
      : current.filter((favorite) => favorite.id !== item.id));

    try {
      await setFavorite(baseUrl, item.id, nextFavorite);
      setStatus('ready');
    } catch (requestError) {
      setItems((current) => wasFavorite
        ? [item, ...current.filter((favorite) => favorite.id !== item.id)]
        : current.filter((favorite) => favorite.id !== item.id));
      setError(requestError instanceof Error ? requestError.message : 'No fue posible actualizar tus favoritos.');
      setStatus('error');
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
    }
  }, [authStatus, baseUrl, busyIds, items, user]);

  const value = useMemo<FavoritesContextValue>(() => ({
    status,
    items,
    error,
    isFavorite,
    isBusy,
    toggleFavorite,
    refresh,
  }), [status, items, error, isFavorite, isBusy, toggleFavorite, refresh]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe utilizarse dentro de FavoritesProvider.');
  return context;
}
