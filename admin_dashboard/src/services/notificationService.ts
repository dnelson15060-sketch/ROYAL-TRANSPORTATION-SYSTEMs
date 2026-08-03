import api from './api';
import type { ApiResponse, Notification, PaginatedResponse } from '../types';

export interface SendNotificationPayload {
  userId: string; // use "all" to broadcast to every user
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendNotification(
  payload: SendNotificationPayload
): Promise<Notification> {
  const { data } = await api.post<ApiResponse<Notification>>(
    '/notifications/send',
    payload
  );
  return data.data;
}

export async function getNotificationHistory(): Promise<Notification[]> {
  const { data } = await api.get<
    PaginatedResponse<Notification> | ApiResponse<Notification[]>
  >('/notifications');
  return data.data;
}
