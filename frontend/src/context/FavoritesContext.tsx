import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import { t } from '../i18n/i18n.js';
import type { ContentItem } from '../models/content.js';
import type { LibraryEntry, ProgressStatus } from '../models/library.js';
import { getLibrary, setLibraryFavorite, setLibraryProgress } from '../services/library.service.js';
import { useAuth } from './AuthContext.js';

type FavoritesStatus = 'idle' | 'loading' | 'ready' | 'error';

interface FavoritesContextValue {
  status: FavoritesStatus;
  items: readonly ContentItem[];
  entries: readonly LibraryEntry[];
  error: string | null;
  isFavorite: (contentId: string) => boolean;
  progressStatus: (contentId: string) => ProgressStatus | null;
  isBusy: (contentId: string) => boolean;
  toggleFavorite: (item: ContentItem) => Promise<void>;
  setProgress: (item: ContentItem, status: ProgressStatus | null) => Promise<void>;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const { status: authStatus, user } = useAuth();
  const [status, setStatus] = useState<FavoritesStatus>('idle');
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const baseUrl = useMemo(() => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD), []);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (authStatus !== 'authenticated' || !user) {
      setEntries([]); setError(null); setStatus('idle'); return;
    }
    setStatus('loading'); setError(null);
    try {
      const result = await getLibrary(baseUrl, signal);
      if (!signal?.aborted) { setEntries(result); setStatus('ready'); }
    } catch {
      if (!signal?.aborted) {
        setError(t('library.error'));
        setStatus('error');
      }
    }
  }, [authStatus, baseUrl, user]);

  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load, user?.id]);
  const refresh = useCallback(async () => { await load(); }, [load]);

  const byId = useMemo(() => new Map(entries.map((entry) => [entry.content.id, entry] as const)), [entries]);
  const items = useMemo(() => entries.filter((entry) => entry.isFavorite).map((entry) => entry.content), [entries]);
  const isFavorite = useCallback((contentId: string) => byId.get(contentId)?.isFavorite ?? false, [byId]);
  const progressStatus = useCallback((contentId: string) => byId.get(contentId)?.progressStatus ?? null, [byId]);
  const isBusy = useCallback((contentId: string) => busyIds.has(contentId), [busyIds]);

  const updateLocal = useCallback((item: ContentItem, favorite: boolean, progress: ProgressStatus | null) => {
    setEntries((current) => {
      const rest = current.filter((entry) => entry.content.id !== item.id);
      if (!favorite && progress === null) return rest;
      return [{ content: item, isFavorite: favorite, progressStatus: progress, updatedAt: new Date().toISOString() }, ...rest];
    });
  }, []);

  const toggleFavorite = useCallback(async (item: ContentItem) => {
    if (authStatus !== 'authenticated' || !user || busyIds.has(item.id)) return;
    const current = byId.get(item.id); const next = !(current?.isFavorite ?? false); const progress = current?.progressStatus ?? null;
    setBusyIds((ids) => new Set(ids).add(item.id)); setError(null); updateLocal(item, next, progress);
    try { await setLibraryFavorite(baseUrl, item.id, next); setStatus('ready'); }
    catch { updateLocal(item, !next, progress); setError(t('library.error')); setStatus('error'); }
    finally { setBusyIds((ids) => { const nextIds = new Set(ids); nextIds.delete(item.id); return nextIds; }); }
  }, [authStatus, baseUrl, busyIds, byId, updateLocal, user]);

  const setProgress = useCallback(async (item: ContentItem, nextProgress: ProgressStatus | null) => {
    if (authStatus !== 'authenticated' || !user || busyIds.has(item.id)) return;
    const current = byId.get(item.id); const favorite = current?.isFavorite ?? false; const previous = current?.progressStatus ?? null;
    setBusyIds((ids) => new Set(ids).add(item.id)); setError(null); updateLocal(item, favorite, nextProgress);
    try { await setLibraryProgress(baseUrl, item.id, nextProgress); setStatus('ready'); }
    catch { updateLocal(item, favorite, previous); setError(t('library.error')); setStatus('error'); }
    finally { setBusyIds((ids) => { const nextIds = new Set(ids); nextIds.delete(item.id); return nextIds; }); }
  }, [authStatus, baseUrl, busyIds, byId, updateLocal, user]);

  const value = useMemo<FavoritesContextValue>(() => ({ status, items, entries, error, isFavorite, progressStatus, isBusy, toggleFavorite, setProgress, refresh }), [status, items, entries, error, isFavorite, progressStatus, isBusy, toggleFavorite, setProgress, refresh]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe utilizarse dentro de FavoritesProvider.');
  return context;
}
