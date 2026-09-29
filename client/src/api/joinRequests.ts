import { api } from './client';
import { EP } from './endpoints';
import type { JoinRequest } from '../types/joinRequest';

export async function getMyJoinRequests(): Promise<JoinRequest[]> {
  const res = await api.get(EP.joinRequestsMy);
  return res.data.data;
}

export async function getProjectJoinRequests(projectId: string): Promise<JoinRequest[]> {
  const res = await api.get(EP.projectRequests(projectId));
  return res.data.data;
}

export async function acceptJoinRequest(id: string): Promise<unknown> {
  const res = await api.post(EP.joinRequestAccept(id));
  return res.data.data;
}

export async function rejectJoinRequest(id: string, reason?: string): Promise<unknown> {
  const res = await api.post(EP.joinRequestReject(id), { reason });
  return res.data.data;
}

export async function withdrawJoinRequest(id: string): Promise<unknown> {
  const res = await api.post(EP.joinRequestWithdraw(id));
  return res.data.data;
}
