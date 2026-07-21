import api from './api';
import type { ApiResponse, Driver, PaginatedResponse } from '../types';

export interface CreateDriverPayload {
  userId: string;
  licenseNumber: string;
  vehicleId?: string;
}

export type UpdateDriverPayload = Partial<CreateDriverPayload> & {
  status?: Driver['status'];
};

export async function getDrivers(): Promise<Driver[]> {
  const { data } = await api.get<
    PaginatedResponse<Driver> | ApiResponse<Driver[]>
  >('/drivers');
  return data.data;
}

export async function getDriverById(id: string): Promise<Driver> {
  const { data } = await api.get<ApiResponse<Driver>>(`/drivers/${id}`);
  return data.data;
}

export async function createDriver(
  payload: CreateDriverPayload
): Promise<Driver> {
  const { data } = await api.post<ApiResponse<Driver>>('/drivers', payload);
  return data.data;
}

export async function updateDriver(
  id: string,
  payload: UpdateDriverPayload
): Promise<Driver> {
  const { data } = await api.patch<ApiResponse<Driver>>(
    `/drivers/${id}`,
    payload
  );
  return data.data;
}

export async function deleteDriver(id: string): Promise<void> {
  await api.delete(`/drivers/${id}`);
}
