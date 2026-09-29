import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { extractError } from '../api/client';
import { getErrorMessage } from '../lib/errorCodes';
import { toast } from './useToast';

export function useLogin() {
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      storeLogin(data.token, data.user);
      qc.invalidateQueries({ queryKey: ['me'] });
      navigate('/dashboard');
    },
    onError: (err) => {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    },
  });
}

export function useRegister() {
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      storeLogin(data.token, data.user);
      navigate('/dashboard');
    },
    onError: (err) => {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return () => {
    logout();
    qc.clear();
    navigate('/login');
  };
}
