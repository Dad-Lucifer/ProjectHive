import { api } from './client';
import { EP } from './endpoints';
import type { User } from '../types/user';
import type { Project } from '../types/project';
import type { Paginated } from '../types/api';

export async function getAdminUsers(params?: { page?: number; limit?: number; search?: string }): Promise<Paginated<User>> {
  const res = await api.get(EP.adminUsers, { params });
  return res.data.data;
}

export async function suspendUser(id: string): Promise<void> {
  await api.post(EP.adminUserSuspend(id));
}

export async function unsuspendUser(id: string): Promise<void> {
  await api.post(EP.adminUserUnsuspend(id));
}

export async function getAdminProjects(params?: { page?: number; limit?: number }): Promise<Paginated<Project>> {
  const res = await api.get(EP.adminProjects, { params });
  return res.data.data;
}

export async function getAuditLogs(): Promise<unknown[]> {
  const res = await api.get(EP.adminAuditLogs);
  return res.data.data;
}
