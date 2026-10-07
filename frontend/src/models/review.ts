export interface ReviewAuthor { username: string; displayName: string | null; }
export interface ReviewItem { id: number; contentId: string; rating: number; body: string; author: ReviewAuthor; createdAt: string; updatedAt: string; isOwner: boolean; }
export interface ReviewList { items: ReviewItem[]; count: number; averageRating: number; }
export type ReviewReportReason = 'spam' | 'abuse' | 'spoiler' | 'other';

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
export function parseReview(value: unknown): ReviewItem {
  if (!isRecord(value) || !isRecord(value.author) || typeof value.id !== 'number' || typeof value.contentId !== 'string' || typeof value.rating !== 'number' || typeof value.body !== 'string' || typeof value.createdAt !== 'string' || typeof value.updatedAt !== 'string' || typeof value.isOwner !== 'boolean' || typeof value.author.username !== 'string') throw new Error('Reseña inválida.');
  return { id:value.id, contentId:value.contentId, rating:value.rating, body:value.body, author:{username:value.author.username, displayName:typeof value.author.displayName==='string'?value.author.displayName:null}, createdAt:value.createdAt, updatedAt:value.updatedAt, isOwner:value.isOwner };
}
export function parseReviewList(value: unknown): ReviewList {
  if(!isRecord(value)||!Array.isArray(value.items)||typeof value.count!=='number'||typeof value.averageRating!=='number')throw new Error('Lista de reseñas inválida.');
  return {items:value.items.map(parseReview),count:value.count,averageRating:value.averageRating};
}
