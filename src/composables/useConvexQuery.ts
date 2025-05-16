import {
  type FunctionArgs,
  type FunctionReference,
  type FunctionReturnType,
  getFunctionName,
} from 'convex/server'
import { computed,type MaybeRef, type MaybeRefOrGetter, ref, toValue, watch } from 'vue'

import { useConvexClient } from './useConvexClient'

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

  if (typeof window !== 'undefined') {
    convex.onUpdate(
      query,
      toValue(args),
      handleResult,
      handleError,
    )
  } else {
    // On the server, subscriptions are not available, so we need to
    // call the query function directly to support SSR.
    const promise = convex.query(query, toValue(args))
    .then(handleResult)
    .catch(handleError)

    return {
      suspense: () => promise,
      data: computed(() => data.value),
      error: computed(() => error.value),
      isLoading: computed(() => data.value === undefined),
    }


  }

  return {
    suspense,
    data,
    error,
    isLoading: computed(() => data.value === undefined),
  }
}
