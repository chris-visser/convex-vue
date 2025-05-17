import {
  type FunctionArgs,
  type FunctionReference,
  type FunctionReturnType,
  getFunctionName,
} from 'convex/server'
import { computed,type MaybeRef, type MaybeRefOrGetter, ref, toValue, watch } from 'vue'

import { useConvexClient } from './useConvexClient'
import { useConvexHttpQuery } from './useConvexHttpQuery';

export type UseConvexQueryOptions = {
  enabled?: MaybeRef<boolean>;
}

export const useConvexQuery = <Query extends FunctionReference<'query'>>(
  query: Query,
  args: MaybeRefOrGetter<FunctionArgs<Query>> = {},
) => {
  const convex = useConvexClient()

  // Initial data
  const data = ref<FunctionReturnType<Query>>(
    convex.client.localQueryResult(getFunctionName(query), toValue(args)),
  )

  const error = ref<Error | null>()

  const suspense = () => {
    if (data.value) {
      return Promise.resolve(data.value)
    }
    if (error.value) {
      return Promise.reject(error.value)
    }

    return new Promise<FunctionReturnType<Query>>((resolve, reject) => {
      const stop = watch(
        () => [data.value, error.value],
        ([newData, newError]) => {
          if (newData) {
            stop()
            resolve(newData)
          } else if (newError) {
            stop()
            reject(newError)
          }
        },
        { immediate: true }
      )
    })
  }

  const handleError = (err: Error) => {
    data.value = null
    error.value = err
  }

  const handleResult = (result: FunctionReturnType<Query>) => {
    data.value = result
    error.value = null
  }

  const isServer = typeof window === 'undefined'
  if (isServer) {
    // The normal query function is not available in the server context
    // so we use the Convex HTTP API instead.
    const promise = useConvexHttpQuery(query, args)
      .then(handleResult)
      .catch(handleError)
    
    return {
      suspense: () => promise,
      data: computed(() => data.value),
      error: computed(() => error.value),
      isLoading: computed(() => data.value === undefined),
    }
  }

  convex.onUpdate(
    query,
    toValue(args),
    handleResult,
    handleError,
  )

  return {
    suspense,
    data,
    error,
    isLoading: computed(() => data.value === undefined),
  }
}

