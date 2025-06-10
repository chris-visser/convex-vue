import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'
import type { MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import {
  getFunctionName,
} from 'convex/server'
import { computed, ref, toValue, watch } from 'vue'

import { useConvexClient } from './useConvexClient'

export type { ComputedRef, MaybeRef, MaybeRefOrGetter } from 'vue'

export interface UseConvexQueryOptions {
  enabled?: MaybeRef<boolean>
}

export function useConvexQuery<Query extends FunctionReference<'query'>>(query: Query, args: MaybeRefOrGetter<FunctionArgs<Query>> = {}) {
  const convex = useConvexClient()

  // Initial data
  const data: Ref<FunctionReturnType<Query>> = ref<FunctionReturnType<Query>>(convex.client.localQueryResult(getFunctionName(query), toValue(args)))
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
          }
          else if (newError) {
            stop()
            reject(newError)
          }
        },
        { immediate: true },
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
    return {
      data,
      error,
      isPending: computed(() => data.value === undefined),
      suspense: () => Promise.resolve(),
    }
  }

  convex.onUpdate(
    query,
    toValue(args),
    handleResult,
    handleError,
  )

  return {
    data,
    error,
    isPending: computed(() => data.value === undefined),
    suspense,
  }
}
