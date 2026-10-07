export interface AniListDevItem {
  id: number;
  title: string;
  coverImage: string;
  year: number | null;
  score: number | null;
  genres: readonly string[];
  siteUrl: string;
}

interface AniListPayload {
  data?: {
    Page?: {
      media?: unknown[];
    };
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function httpsUrl(value: unknown, allowedHost: string): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === allowedHost ? url.toString() : null;
  } catch {
    return null;
  }
}

function parseItem(value: unknown): AniListDevItem | null {
  if (!isRecord(value) || typeof value.id !== 'number' || !isRecord(value.title) || !isRecord(value.coverImage)) {
    return null;
  }
  const english = typeof value.title.english === 'string' ? value.title.english.trim() : '';
  const romaji = typeof value.title.romaji === 'string' ? value.title.romaji.trim() : '';
  const native = typeof value.title.native === 'string' ? value.title.native.trim() : '';
  const title = english || romaji || native;
  const coverImage = httpsUrl(value.coverImage.large, 's4.anilist.co');
  const siteUrl = httpsUrl(value.siteUrl, 'anilist.co');
  if (!title || !coverImage || !siteUrl) return null;

  const genres = Array.isArray(value.genres)
    ? value.genres.filter((genre): genre is string => typeof genre === 'string').slice(0, 3)
    : [];
  const year = typeof value.seasonYear === 'number' && Number.isInteger(value.seasonYear) ? value.seasonYear : null;
  const score = typeof value.averageScore === 'number' ? value.averageScore / 10 : null;

  return { id: value.id, title, coverImage, year, score, genres, siteUrl };
}

/** Development-only diagnostic request. The production catalog still comes from PostgreSQL. */
export async function getAniListDevPreview(signal?: AbortSignal): Promise<AniListDevItem[]> {
  const query = `
    query AniVideosDevPreview($page: Int!, $perPage: Int!) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          id
          title { romaji english native }
          coverImage { large }
          seasonYear
          averageScore
          genres
          siteUrl
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { page: 1, perPage: 8 } }),
    credentials: 'omit',
    cache: 'no-store',
    signal,
  });
  if (!response.ok) throw new Error(`AniList responded ${response.status}`);
  const payload = await response.json() as AniListPayload;
  const media = payload.data?.Page?.media;
  if (!Array.isArray(media)) throw new Error('AniList payload invalid');
  return media.flatMap((item) => {
    const parsed = parseItem(item);
    return parsed ? [parsed] : [];
  });
}
