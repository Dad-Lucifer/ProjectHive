import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notifApi from '../api/notifications';
import { useAuthStore } from '../store/authStore';

export function useNotifications(params?: { page?: number; limit?: number }) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notifApi.getNotifications(params),
    enabled: !!token,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notifApi.markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notifApi.markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
