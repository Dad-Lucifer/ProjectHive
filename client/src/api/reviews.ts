import { api } from './client';
import { EP } from './endpoints';
import type { Review } from '../types/review';

export async function getProjectReviews(projectId: string): Promise<Review[]> {
  const res = await api.get(EP.projectReviews(projectId));
  return res.data.data;
}

export async function createReview(projectId: string, data: { revieweeId: string; rating: number; comment?: string }): Promise<Review> {
  const res = await api.post(EP.projectReviews(projectId), data);
  return res.data.data;
}

export async function updateReview(id: string, data: { rating: number; comment?: string }): Promise<Review> {
  const res = await api.put(EP.review(id), data);
  return res.data.data;
}
