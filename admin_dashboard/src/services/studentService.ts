import api from './api';
import type { ApiResponse, PaginatedResponse, Student } from '../types';

export interface CreateStudentPayload {
  name: string;
  parentId: string;
  grade: string;
  school: string;
  routeId?: string;
  seatNumber?: number;
}

export type UpdateStudentPayload = Partial<CreateStudentPayload> & {
  status?: Student['status'];
};

export async function getStudents(): Promise<Student[]> {
  const { data } = await api.get<
    PaginatedResponse<Student> | ApiResponse<Student[]>
  >('/students');
  return data.data;
}

export async function getStudentById(id: string): Promise<Student> {
  const { data } = await api.get<ApiResponse<Student>>(`/students/${id}`);
  return data.data;
}

export async function createStudent(
  payload: CreateStudentPayload
): Promise<Student> {
  const { data } = await api.post<ApiResponse<Student>>('/students', payload);
  return data.data;
}

export async function updateStudent(
  id: string,
  payload: UpdateStudentPayload
): Promise<Student> {
  const { data } = await api.patch<ApiResponse<Student>>(
    `/students/${id}`,
    payload
  );
  return data.data;
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}
