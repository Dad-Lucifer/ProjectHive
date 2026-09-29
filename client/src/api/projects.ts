import { api } from './client';
import { EP } from './endpoints';
import type { Project } from '../types/project';
import type { Paginated } from '../types/api';
import type { ProjectMembership } from '../types/membership';
import type { Task } from '../types/task';

export interface ProjectFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getProjects(filters: ProjectFilters = {}): Promise<Paginated<Project>> {
  const res = await api.get(EP.projects, { params: filters });
  return res.data.data;
}

export async function getProject(id: string): Promise<Project> {
  const res = await api.get(EP.project(id));
  return res.data.data;
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const res = await api.post(EP.projects, data);
  return res.data.data;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await api.put(EP.project(id), data);
  return res.data.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(EP.project(id));
}

export async function getProjectMembers(id: string): Promise<ProjectMembership[]> {
  const res = await api.get(EP.projectMembers(id));
  return res.data.data;
}

export async function getProjectTasks(id: string): Promise<Task[]> {
  const res = await api.get(EP.projectTasks(id));
  return res.data.data;
}

export async function getProjectAnalytics(id: string): Promise<unknown> {
  const res = await api.get(EP.projectAnalytics(id));
  return res.data.data;
}

export async function completeProject(id: string): Promise<Project> {
  const res = await api.post(EP.projectComplete(id));
  return res.data.data;
}

export async function createJoinRequest(projectId: string, data: { requestedRole?: string; message: string }): Promise<unknown> {
  const res = await api.post(EP.projectJoinRequest(projectId), data);
  return res.data.data;
}
