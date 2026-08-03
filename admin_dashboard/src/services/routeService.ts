import api from './api';
import type {
  ApiResponse,
  DashboardSummary,
  PaginatedResponse,
  Route,
  RouteStop,
} from '../types';

export interface CreateRoutePayload {
  name: string;
  driverId?: string;
  busId?: string;
  stops: RouteStop[];
  studentIds?: string[];
  startTime?: string;
  endTime?: string;
}

export type UpdateRoutePayload = Partial<CreateRoutePayload> & {
  status?: Route['status'];
};

export async function getRoutes(): Promise<Route[]> {
  const { data } = await api.get<
    PaginatedResponse<Route> | ApiResponse<Route[]>
  >('/routes');
  return data.data;
}

export async function getRouteById(id: string): Promise<Route> {
  const { data } = await api.get<ApiResponse<Route>>(`/routes/${id}`);
  return data.data;
}

export async function createRoute(payload: CreateRoutePayload): Promise<Route> {
  const { data } = await api.post<ApiResponse<Route>>('/routes', payload);
  return data.data;
}

export async function updateRoute(
  id: string,
  payload: UpdateRoutePayload
): Promise<Route> {
  const { data } = await api.patch<ApiResponse<Route>>(
    `/routes/${id}`,
    payload
  );
  return data.data;
}

export async function assignDriver(
  routeId: string,
  driverId: string
): Promise<Route> {
  const { data } = await api.patch<ApiResponse<Route>>(
    `/routes/${routeId}/assign-driver`,
    { driverId }
  );
  return data.data;
}

export async function assignStudents(
  routeId: string,
  studentIds: string[]
): Promise<Route> {
  const { data } = await api.patch<ApiResponse<Route>>(
    `/routes/${routeId}/assign-students`,
    { studentIds }
  );
  return data.data;
}

export async function deleteRoute(id: string): Promise<void> {
  await api.delete(`/routes/${id}`);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await api.get<ApiResponse<DashboardSummary>>(
    '/dashboard/summary'
  );
  return data.data;
}
