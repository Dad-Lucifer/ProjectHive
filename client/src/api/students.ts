import { api } from './client';
import { EP } from './endpoints';
import type { User } from '../types/user';
import type { XpEvent } from '../types/xpEvent';
import type { Project } from '../types/project';

export async function getStudent(id: string): Promise<User> {
  const res = await api.get(EP.student(id));
  return res.data.data;
}

export async function getStudentContributions(id: string): Promise<unknown[]> {
  const res = await api.get(EP.studentContributions(id));
  return res.data.data;
}

export async function getStudentProjects(id: string): Promise<Project[]> {
  const res = await api.get(EP.studentProjects(id));
  return res.data.data;
}

export async function getStudentRecommendations(id: string): Promise<Project[]> {
  const res = await api.get(EP.studentRecommendations(id));
  return res.data.data;
}

export async function getStudentXpHistory(id: string): Promise<XpEvent[]> {
  const res = await api.get(EP.studentXpHistory(id));
  return res.data.data;
}

export async function updateMe(data: Partial<User>): Promise<User> {
  const res = await api.put('/students/me', data);
  return res.data.data;
}
