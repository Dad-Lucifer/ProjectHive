import { api } from './client';
import { EP } from './endpoints';
import type { Notification } from '../types/notification';
import type { Paginated } from '../types/api';

export async function getNotifications(params?: { page?: number; limit?: number }): Promise<Paginated<Notification>> {
  const res = await api.get(EP.notifications, { params });
  return res.data.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.post(EP.notificationRead(id));
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post(EP.notificationsReadAll);
}
