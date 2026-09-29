export interface BannerCommentAuthor {
  username: string;
  displayName: string | null;
}

export interface BannerComment {
  id: number;
  bannerId: string;
  body: string;
  author: BannerCommentAuthor;
  createdAt: string;
  isOwner: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseBannerComment(value: unknown): BannerComment {
  if (!isRecord(value) || !isRecord(value.author)) throw new Error('Comentario inválido.');
  if (
    typeof value.id !== 'number' || !Number.isInteger(value.id) || value.id < 1 ||
    typeof value.bannerId !== 'string' || value.bannerId.length === 0 ||
    typeof value.body !== 'string' || value.body.length === 0 || value.body.length > 1000 ||
    typeof value.createdAt !== 'string' || value.createdAt.length === 0 ||
    typeof value.isOwner !== 'boolean' ||
    typeof value.author.username !== 'string' || value.author.username.length === 0 ||
    !(value.author.displayName === null || typeof value.author.displayName === 'string')
  ) {
    throw new Error('Comentario inválido.');
  }

  return {
    id: value.id,
    bannerId: value.bannerId,
    body: value.body,
    author: {
      username: value.author.username,
      displayName: value.author.displayName,
    },
    createdAt: value.createdAt,
    isOwner: value.isOwner,
  };
}

export function parseBannerCommentList(value: unknown): BannerComment[] {
  if (!isRecord(value) || !Array.isArray(value.items)) throw new Error('Lista de comentarios inválida.');
  return value.items.map(parseBannerComment);
}

export function validateCommentBody(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) return 'Escribe un comentario antes de publicarlo.';
  if (normalized.length > 1000) return 'El comentario admite hasta 1000 caracteres.';
  return null;
}
