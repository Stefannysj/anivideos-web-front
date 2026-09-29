export interface FavoriteStateResponse {
  contentId: string;
  isFavorite: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Validates the minimal mutation response returned by the favorites API. */
export function parseFavoriteStateResponse(value: unknown): FavoriteStateResponse {
  if (
    !isRecord(value) ||
    typeof value.contentId !== 'string' ||
    value.contentId.length === 0 ||
    typeof value.isFavorite !== 'boolean'
  ) {
    throw new Error('Respuesta de favoritos inválida.');
  }
  return { contentId: value.contentId, isFavorite: value.isFavorite };
}
