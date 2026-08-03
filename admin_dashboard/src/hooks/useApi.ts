import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export interface ApiErrorShape {
  message: string;
}

/**
 * Thin wrapper around React Query's useQuery for GET-style API calls.
 * Centralizes error typing so pages don't need to repeat AxiosError generics.
 */
export function useApiQuery<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, AxiosError<ApiErrorShape>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TData, AxiosError<ApiErrorShape>> {
  return useQuery({
    queryKey: queryKey as unknown[],
    queryFn,
    ...options,
  });
}

/**
 * Thin wrapper around React Query's useMutation for POST/PATCH/DELETE calls.
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, AxiosError<ApiErrorShape>, TVariables>,
    'mutationFn'
  >
): UseMutationResult<TData, AxiosError<ApiErrorShape>, TVariables> {
  return useMutation({
    mutationFn,
    ...options,
  });
}

/**
 * Extracts a user-friendly error message from an Axios error returned by the API.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  const axiosError = error as AxiosError<ApiErrorShape> | undefined;
  return axiosError?.response?.data?.message ?? fallback;
}
