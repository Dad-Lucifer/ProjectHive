import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMe } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export function useCurrentUser() {
  const { token, setCurrentUser, setIsLoading } = useAuthStore();

  const query = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    if (query.data) setCurrentUser(query.data);
    setIsLoading(query.isLoading);
  }, [token, query.data, query.isLoading, setCurrentUser, setIsLoading]);

  return query;
}
