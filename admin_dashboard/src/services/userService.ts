import api from './api';
import type { ApiResponse, PaginatedResponse, User } from '../types';

export async function getUsers(params?: {
  role?: string;
  search?: string;
}): Promise<User[]> {
  const { data } = await api.get<PaginatedResponse<User> | ApiResponse<User[]>>(
    '/users',
    { params }
  );
  return data.data;
}

export async function getUserById(uid: string): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>(`/users/${uid}`);
  return data.data;
}

export async function updateUser(
  uid: string,
  payload: Partial<User>
): Promise<User> {
  const { data } = await api.patch<ApiResponse<User>>(`/users/${uid}`, payload);
  return data.data;
}

export async function deleteUser(uid: string): Promise<void> {
  await api.delete(`/users/${uid}`);
}
