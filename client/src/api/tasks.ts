import { api } from './client';
import { EP } from './endpoints';
import type { Task } from '../types/task';

export async function createTask(projectId: string, data: Partial<Task>): Promise<Task> {
  const res = await api.post(EP.projectTasks(projectId), data);
  return res.data.data;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  const res = await api.put(EP.task(id), data);
  return res.data.data;
}

export async function submitTask(id: string): Promise<Task> {
  const res = await api.post(EP.taskSubmit(id));
  return res.data.data;
}

export async function verifyTask(id: string, comment?: string): Promise<Task> {
  const res = await api.post(EP.taskVerify(id), { comment });
  return res.data.data;
}

export async function rejectTask(id: string, comment: string): Promise<Task> {
  const res = await api.post(EP.taskReject(id), { comment });
  return res.data.data;
}
