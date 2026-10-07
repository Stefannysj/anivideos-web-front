import { parseCatalogResponse } from './content.js';
import type { ContentItem } from './content.js';

export type ProgressStatus = 'watching' | 'completed' | 'planned';

export interface LibraryEntry {
  content: ContentItem;
  isFavorite: boolean;
  progressStatus: ProgressStatus | null;
  updatedAt: string;
}

export interface LibraryState {
  contentId: string;
  isFavorite: boolean;
  progressStatus: ProgressStatus | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseLibraryResponse(value: unknown): LibraryEntry[] {
  if (!isRecord(value) || !Array.isArray(value.items)) throw new Error('Lista personal inválida.');
  return value.items.map((entry): LibraryEntry => {
    if (!isRecord(entry) || typeof entry.isFavorite !== 'boolean' || typeof entry.updatedAt !== 'string') {
      throw new Error('Entrada de lista personal inválida.');
    }
    const progress = entry.progressStatus;
    if (!(progress === null || progress === 'watching' || progress === 'completed' || progress === 'planned')) {
      throw new Error('Estado de lista personal inválido.');
    }
    const content = parseCatalogResponse({ items: [entry.content] })[0];
    if (!content) throw new Error('Contenido de lista personal inválido.');
    return { content, isFavorite: entry.isFavorite, progressStatus: progress, updatedAt: entry.updatedAt };
  });
}

export function parseLibraryState(value: unknown): LibraryState {
  if (!isRecord(value) || typeof value.contentId !== 'string' || typeof value.isFavorite !== 'boolean') {
    throw new Error('Estado de lista inválido.');
  }
  const progress = value.progressStatus;
  if (!(progress === null || progress === 'watching' || progress === 'completed' || progress === 'planned')) {
    throw new Error('Estado de progreso inválido.');
  }
  return { contentId: value.contentId, isFavorite: value.isFavorite, progressStatus: progress };
}
