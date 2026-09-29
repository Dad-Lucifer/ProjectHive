import { api } from './client';
import { EP } from './endpoints';
import type { Category } from '../types/category';

export async function getCategories(): Promise<Category[]> {
  const res = await api.get(EP.categories);
  return res.data.data;
}
