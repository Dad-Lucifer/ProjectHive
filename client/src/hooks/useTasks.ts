import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../api/tasks';
import type { Task } from '../types/task';

export function useCreateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Task>) => taskApi.createTask(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId, 'tasks'] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) => taskApi.updateTask(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId, 'tasks'] });
    },
  });
}

export function useSubmitTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskApi.submitTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId, 'tasks'] });
    },
  });
}

export function useVerifyTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => taskApi.verifyTask(id, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId, 'tasks'] });
      qc.invalidateQueries({ queryKey: ['progression'] });
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useRejectTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) => taskApi.rejectTask(id, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId, 'tasks'] });
    },
  });
}
