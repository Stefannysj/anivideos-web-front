import type { TranslationKey } from '../i18n/translations.js';

export type ContentCategory = 'anime' | 'k-drama' | 'j-drama' | 'donghua' | 'movie' | 'ova';
export type ContentSource = 'anilist' | 'tmdb';

export interface PlatformLink {
  name: string;
  url: string;
  attribution?: string | null;
}

export interface ContentItem {
  id: string;
  source: ContentSource;
  sourceAttribution: string;
  externalId: string;
  title: string;
  originalTitle: string | null;
  category: ContentCategory;
  categoryLabel: string;
  year: number | null;
  score: number;
  maturity: string;
  format: string;
  genres: readonly string[];
  artwork: string;
  studio: string | null;
  episodes: number | null;
  status: string;
}

export interface ContentDetail extends ContentItem {
  synopsis: string;
  origin: string;
  backdropUrl: string | null;
  trailerYoutubeId: string | null;
  officialUrl: string | null;
  platformLinks: readonly PlatformLink[];
  sourceUrl: string | null;
  season: string | null;
  seasonYear: number | null;
  nextAiringAt: string | null;
  nextEpisodeNumber: number | null;
}

export interface CatalogSection {
  id: 'anime' | 'k-dramas' | 'j-dramas' | 'donghua' | 'peliculas' | 'ovas';
  labelKey: TranslationKey;
  category: ContentCategory;
}

export const catalogSections = [
  { id: 'anime', labelKey: 'category.anime', category: 'anime' },
  { id: 'k-dramas', labelKey: 'category.k-drama', category: 'k-drama' },
  { id: 'j-dramas', labelKey: 'category.j-drama', category: 'j-drama' },
  { id: 'donghua', labelKey: 'category.donghua', category: 'donghua' },
  { id: 'peliculas', labelKey: 'category.movie', category: 'movie' },
  { id: 'ovas', labelKey: 'category.ova', category: 'ova' },
] as const satisfies readonly CatalogSection[];

const categories = new Set<ContentCategory>(['anime', 'k-drama', 'j-drama', 'donghua', 'movie', 'ova']);
const sources = new Set<ContentSource>(['anilist', 'tmdb']);
const allowedArtworkHosts = new Set(['s4.anilist.co', 's3.anilist.co', 'image.tmdb.org']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function allowedHttpsUrl(value: unknown, hosts?: Set<string>): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (!hosts || hosts.has(url.hostname));
  } catch {
    return false;
  }
}

function parsePlatformLinks(value: unknown): PlatformLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.name !== 'string' || !allowedHttpsUrl(item.url)) return [];
    return [{
      name: item.name,
      url: item.url,
      attribution: typeof item.attribution === 'string' ? item.attribution : null,
    }];
  });
}

export function parseCatalogResponse(value: unknown): ContentItem[] {
  if (!isRecord(value) || !Array.isArray(value.items)) throw new Error('El catálogo recibido no es válido.');
  return value.items.map((item): ContentItem => {
    if (!isRecord(item)) throw new Error('Elemento de catálogo inválido.');
    if (
      typeof item.id !== 'string' || !/^[a-z0-9-]{1,120}$/.test(item.id) ||
      typeof item.source !== 'string' || !sources.has(item.source as ContentSource) ||
      typeof item.sourceAttribution !== 'string' || typeof item.externalId !== 'string' ||
      typeof item.title !== 'string' || item.title.length === 0 ||
      !(item.originalTitle === null || typeof item.originalTitle === 'string') ||
      typeof item.category !== 'string' || !categories.has(item.category as ContentCategory) ||
      typeof item.categoryLabel !== 'string' ||
      !(item.year === null || (typeof item.year === 'number' && Number.isInteger(item.year))) ||
      typeof item.score !== 'number' || item.score < 0 || item.score > 10 ||
      typeof item.maturity !== 'string' || typeof item.format !== 'string' ||
      !Array.isArray(item.genres) || !item.genres.every((genre) => typeof genre === 'string') ||
      !allowedHttpsUrl(item.artwork, allowedArtworkHosts) ||
      !(item.studio === null || typeof item.studio === 'string') ||
      !(item.episodes === null || (typeof item.episodes === 'number' && Number.isInteger(item.episodes))) ||
      typeof item.status !== 'string'
    ) throw new Error('Elemento de catálogo inválido.');

    return {
      id: item.id,
      source: item.source as ContentSource,
      sourceAttribution: item.sourceAttribution,
      externalId: item.externalId,
      title: item.title,
      originalTitle: item.originalTitle,
      category: item.category as ContentCategory,
      categoryLabel: item.categoryLabel,
      year: item.year,
      score: item.score,
      maturity: item.maturity,
      format: item.format,
      genres: item.genres,
      artwork: item.artwork,
      studio: item.studio,
      episodes: item.episodes,
      status: item.status,
    };
  });
}

export function parseContentDetailResponse(value: unknown): ContentDetail {
  if (!isRecord(value)) throw new Error('El detalle recibido no es válido.');
  const parsed = parseCatalogResponse({ items: [value] })[0];
  if (!parsed || typeof value.synopsis !== 'string' || typeof value.origin !== 'string') {
    throw new Error('El detalle recibido no es válido.');
  }
  return {
    ...parsed,
    synopsis: value.synopsis,
    origin: value.origin,
    backdropUrl: allowedHttpsUrl(value.backdropUrl, allowedArtworkHosts) ? value.backdropUrl : null,
    trailerYoutubeId: typeof value.trailerYoutubeId === 'string' && /^[A-Za-z0-9_-]{6,20}$/.test(value.trailerYoutubeId) ? value.trailerYoutubeId : null,
    officialUrl: allowedHttpsUrl(value.officialUrl) ? value.officialUrl : null,
    platformLinks: parsePlatformLinks(value.platformLinks),
    sourceUrl: allowedHttpsUrl(value.sourceUrl) ? value.sourceUrl : null,
    season: typeof value.season === 'string' ? value.season : null,
    seasonYear: typeof value.seasonYear === 'number' ? value.seasonYear : null,
    nextAiringAt: typeof value.nextAiringAt === 'string' ? value.nextAiringAt : null,
    nextEpisodeNumber: typeof value.nextEpisodeNumber === 'number' ? value.nextEpisodeNumber : null,
  };
}

export function filterContentByCategory(items: readonly ContentItem[], category: ContentCategory): ContentItem[] {
  return items.filter((item) => item.category === category);
}
