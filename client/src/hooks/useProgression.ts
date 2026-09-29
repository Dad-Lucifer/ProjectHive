import { useQuery } from '@tanstack/react-query';
import { getMyProgression } from '../api/progression';
import { useAuthStore } from '../store/authStore';

export function useProgression() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['progression'],
    queryFn: getMyProgression,
    enabled: !!token,
    staleTime: 60 * 1000,
  });
}
