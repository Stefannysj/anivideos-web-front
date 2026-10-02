import { parseAuthApiError } from '../models/auth.js';
import type { AuthApiError } from '../models/auth.js';
import { parseBannerComment, parseBannerCommentList } from '../models/comment.js';
import type { BannerComment } from '../models/comment.js';
import { apiFetch, readJson } from './http.js';

export class CommentRequestError extends Error {
  readonly details: AuthApiError;

  constructor(details: AuthApiError) {
    super(details.message);
    this.name = 'CommentRequestError';
    this.details = details;
  }
}

export async function getBannerComments(
  baseUrl: string,
  bannerId: string,
  signal?: AbortSignal,
): Promise<BannerComment[]> {
  const response = await apiFetch(`${baseUrl}/banners/${encodeURIComponent(bannerId)}/comments`, {
    method: 'GET',
    signal,
  });
  const payload = await readJson(response).catch(() => null);
  if (!response.ok) throw new CommentRequestError(parseAuthApiError(payload, 'No fue posible cargar los comentarios.'));
  return parseBannerCommentList(payload);
}

export async function publishBannerComment(
  baseUrl: string,
  bannerId: string,
  body: string,
): Promise<BannerComment> {
  const response = await apiFetch(`${baseUrl}/banners/${encodeURIComponent(bannerId)}/comments`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  const payload = await readJson(response).catch(() => null);
  if (!response.ok) throw new CommentRequestError(parseAuthApiError(payload, 'No fue posible publicar el comentario.'));
  return parseBannerComment(payload);
}

export async function deleteBannerComment(
  baseUrl: string,
  bannerId: string,
  commentId: number,
): Promise<void> {
  const response = await apiFetch(`${baseUrl}/banners/${encodeURIComponent(bannerId)}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const payload = await readJson(response).catch(() => null);
    throw new CommentRequestError(parseAuthApiError(payload, 'No fue posible eliminar el comentario.'));
  }
}
