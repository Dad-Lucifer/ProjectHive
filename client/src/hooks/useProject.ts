import { useQuery } from '@tanstack/react-query';
import { getProject, getProjectMembers, getProjectTasks } from '../api/projects';

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProjectMembers(id: string) {
  return useQuery({
    queryKey: ['project', id, 'members'],
    queryFn: () => getProjectMembers(id),
    enabled: !!id,
  });
}

export function useProjectTasks(id: string) {
  return useQuery({
    queryKey: ['project', id, 'tasks'],
    queryFn: () => getProjectTasks(id),
    enabled: !!id,
  });
}
