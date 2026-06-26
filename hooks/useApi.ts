/* eslint-disable @typescript-eslint/no-explicit-any */

import { TgenericResponse } from "@/lib/apiResponse";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/utils/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

type TFetchOptions<TData> = Omit<
  UseQueryOptions<TgenericResponse<TData>, Error>,
  "queryKey" | "queryFn"
>;

export const useFetchData = <TData>(
  key: string[],
  endPoint: string,
  options?: TFetchOptions<TData>,
) => {
  return useQuery({
    queryKey: key,
    queryFn: () => apiGet(endPoint),
    ...options,
  });
};

type Legacy_TFetchOptions<TData> = Omit<
  UseQueryOptions<TData, Error>,
  "queryKey" | "queryFn"
>;

export const useFetch_Legacy = <TData>(
  key: string[],
  endPoint: string,
  options?: Legacy_TFetchOptions<TData>,
) => {
  return useQuery({
    queryKey: key,
    queryFn: () => apiGet(endPoint),
    ...options,
  });
};

interface IGenericResponse<T> {
  data: T;
  meta?: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    total_data: number;
    current_page?: number;
    next_page?: number;
    previous_page?: number;
    total_page?: number;
    limit?: number;
  };
}

export const useGet = <T = unknown>( // default type = unknown
  endpoint: string,
  queryKey: string[],
  queryParams?: Record<string, unknown>,
  options?: Omit<
    UseQueryOptions<IGenericResponse<T>, IGenericResponse<T>, string[]>,
    "queryKey" | "queryFn"
  >,
) => {
  // Filter out empty/null params
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams || {}).filter(
      ([_, value]) => value !== "" && value != null,
    ),
  );

  const finalQueryKey = [
    ...queryKey,
    ...Object.values(filteredParams).map(String),
  ];

  return useQuery<IGenericResponse<T>, IGenericResponse<T>, string[]>({
    queryKey: finalQueryKey,
    queryFn: () => apiGet(endpoint),

    retry: false,
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const usePost = (invalidateQueriesKeys?: Array<string[]>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      url: string;
      payload: Record<string, unknown> | FormData;
    }) => {
      return apiPost(params.url, params.payload);
    },
    onSuccess: (data) => {
      if (invalidateQueriesKeys) {
        invalidateQueriesKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
    onError: (error: any) => {
      // console.log("error = ", error?.response?.data?.message);
      // toast.error(
      //   error?.response?.data?.message || error.message || "Failed to Add.",
      // );
      throw error;
    },
  });
};

// Update Hook
export const useUpdateData = (key: string[], endPoint: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => apiPut(endPoint, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};

export const usePatch = (invalidateQueriesKeys?: Array<string[]>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      url: string;
      payload: Record<string, unknown> | FormData;
    }) => {
      return apiPatch(params.url, params.payload);
    },
    onSuccess: () => {
      if (invalidateQueriesKeys) {
        invalidateQueriesKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
    onError: (error) => {
      // toast.error(error.message || "Failed to update.");
      throw error;
    },
  });
};

export const useDeleteData = (invalidateQueriesKeys?: Array<string[]>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { url: string }) => {
      return apiDelete(params?.url);
    },
    onSuccess: () => {
      if (invalidateQueriesKeys) {
        invalidateQueriesKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
    onError: (error) => {
      // toast.error(error.message || "Failed to Delete");
      throw error;
    },
  });
};
