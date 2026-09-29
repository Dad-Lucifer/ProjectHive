import { api } from './client';
import { EP } from './endpoints';
import type { Skill } from '../types/skill';

export async function getSkills(): Promise<Skill[]> {
  const res = await api.get(EP.skills);
  return res.data.data;
}
