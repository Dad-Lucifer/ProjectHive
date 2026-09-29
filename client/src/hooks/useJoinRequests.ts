import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jr from '../api/joinRequests';
import { createJoinRequest } from '../api/projects';

export function useMyJoinRequests() {
  return useQuery({
    queryKey: ['join-requests', 'my'],
    queryFn: jr.getMyJoinRequests,
  });
}

export function useProjectJoinRequests(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId, 'requests'],
    queryFn: () => jr.getProjectJoinRequests(projectId),
    enabled: !!projectId,
  });
}

export function useCreateJoinRequest(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { requestedRole?: string; message: string }) => createJoinRequest(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId] });
      qc.invalidateQueries({ queryKey: ['join-requests', 'my'] });
    },
  });
}

export function useAcceptJoinRequest(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: jr.acceptJoinRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId, 'requests'] });
      qc.invalidateQueries({ queryKey: ['project', projectId, 'members'] });
      qc.invalidateQueries({ queryKey: ['progression'] });
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useRejectJoinRequest(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => jr.rejectJoinRequest(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId, 'requests'] });
    },
  });
}

export function useWithdrawJoinRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: jr.withdrawJoinRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['join-requests', 'my'] });
    },
  });
}
