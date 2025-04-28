import {
  QueryKey,
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
  useMutation,
  UseMutationResult,
  UseMutationOptions,
  MutationFunction,
  useQueries,
} from '@tanstack/react-query'

export const queryEntity = <TData, TError>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TData, QueryKey>,
  defaultConfig?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
): ((
  config?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
) => UseQueryResult<TData, TError>) => {
  return function useQueryWithConfig(config?) {
    return useQuery<TData, TError>({
      queryKey,
      queryFn,
      ...defaultConfig,
      ...config,
    })
  }
}

export const queryEntityById = <TData, TError>(
  queryKey: QueryKey,
  getQueryFn: (id: string) => QueryFunction<TData, QueryKey>,
  defaultConfig?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
): ((
  id: string | undefined,
  config?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
) => UseQueryResult<TData, TError>) => {
  return function useQueryWithConfig(id, config?) {
    const { enabled, ...restConfig } = config || {}
    const enabledByProps = enabled ?? !!id
    return useQuery<TData, TError>({
      queryKey: [...queryKey, id] as QueryKey,
      queryFn: id ? getQueryFn(id) : () => Promise.resolve({} as TData),
      enabled: enabledByProps,
      ...defaultConfig,
      ...restConfig,
    })
  }
}

export const queryMultipleEntitiesById = <TData, TError>(
  queryKey: QueryKey,
  getQueryFn: (id: string) => QueryFunction<TData, QueryKey>,
  defaultConfig?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
) => {
  return function useQueryWithConfig(
    ids: string[] | undefined,
    config?: Omit<
      UseQueryOptions<TData, TError, TData, QueryKey>,
      'queryKey' | 'queryFn'
    >
  ) {
    const { enabled, ...restConfig } = config || {}
    const enabledByProps = enabled ?? !!ids
    return useQueries({
      queries:
        ids?.map((id) => ({
          queryKey: [...queryKey, id] as QueryKey,
          queryFn: id ? getQueryFn(id) : () => Promise.resolve({} as TData),
          enabled: enabledByProps,
          ...defaultConfig,
          ...restConfig,
        })) || [],
    })
  }
}

export const mutateEntity = <
  TResponseData,
  TError,
  TVariables,
  TContext = unknown
>(
  getMutationFn: () => MutationFunction<TResponseData, TVariables>,
  defaultConfig?: Omit<
    UseMutationOptions<TResponseData, TError, TVariables, TContext>,
    'mutationFn'
  >
): ((
  config?: Omit<
    UseMutationOptions<TResponseData, TError, TVariables, TContext>,
    'mutationFn'
  >
) => UseMutationResult<TResponseData, TError, TVariables, TContext>) => {
  return function useMutationWithConfig(config?) {
    return useMutation<TResponseData, TError, TVariables, TContext>({
      mutationFn: getMutationFn(),
      ...defaultConfig,
      ...config,
    })
  }
}
