import { api } from './client';
import { EP } from './endpoints';
import type { User } from '../types/user';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; }
export interface AuthResponse { token: string; user: User; }

export async function login(data: LoginPayload): Promise<AuthResponse> {
  const res = await api.post(EP.authLogin, data);
  return res.data.data;
}

export async function register(data: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post(EP.authRegister, data);
  return res.data.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get(EP.authMe);
  return res.data.data;
}
