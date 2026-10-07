import { parseReview, parseReviewList } from '../models/review.js';
import type { ReviewItem, ReviewList, ReviewReportReason } from '../models/review.js';
import { apiFetch, readJson } from './http.js';

export async function getReviews(baseUrl:string,contentId:string,signal?:AbortSignal):Promise<ReviewList>{
  const response=await apiFetch(`${baseUrl}/content/${encodeURIComponent(contentId)}/reviews`,{method:'GET',signal});
  if(!response.ok)throw new Error('Reviews request failed');
  return parseReviewList(await readJson(response));
}
export async function saveReview(baseUrl:string,contentId:string,rating:number,body:string):Promise<ReviewItem>{
  const response=await apiFetch(`${baseUrl}/content/${encodeURIComponent(contentId)}/review`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({rating,body})});
  if(!response.ok)throw new Error('Review save failed');
  return parseReview(await readJson(response));
}
export async function deleteReview(baseUrl:string,contentId:string):Promise<void>{
  const response=await apiFetch(`${baseUrl}/content/${encodeURIComponent(contentId)}/review`,{method:'DELETE'}); if(!response.ok)throw new Error('Review delete failed');
}
export async function reportReview(baseUrl:string,reviewId:number,reason:ReviewReportReason,detail:string):Promise<void>{
  const response=await apiFetch(`${baseUrl}/reviews/${reviewId}/reports`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason,detail:detail.trim()||null})}); if(!response.ok)throw new Error('Review report failed');
}
