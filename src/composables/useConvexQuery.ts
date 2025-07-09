import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'
import type { MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import {
  getFunctionName,
} from 'convex/server'

import { computed, onScopeDispose, ref, toValue, watch } from 'vue'
import { useConvexClient } from './useConvexClient'

export type { ComputedRef, MaybeRef, MaybeRefOrGetter } from 'vue'

export interface UseConvexQueryOptions {
  enabled?: MaybeRef<boolean>
}

export type EmptyObject = Record<string, never>
export type OptionalRestArgsOrSkip<FuncRef extends FunctionReference<any>> = FuncRef['_args'] extends EmptyObject ? [args?: EmptyObject | undefined] : [args: MaybeRefOrGetter<FuncRef['_args']>]

export function useConvexQuery<Query extends FunctionReference<'query'>>(query: Query, ...args: OptionalRestArgsOrSkip<Query>) {
  const convex = useConvexClient()
  const queryArgs = computed(() => toValue(args[0]))

  // Initial data
  const data: Ref<FunctionReturnType<Query> | undefined> = ref<FunctionReturnType<Query> | undefined>(convex.client.localQueryResult(getFunctionName(query), queryArgs.value))
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

  const createSubscription = (args: FunctionArgs<Query>) => {
    return convex.onUpdate(
      query,
      args,
      handleResult,
      handleError,
    )
  }

  // recreate subscription when args change
  let cancelSubscription: () => void | undefined
  watch(queryArgs, (newArgs) => {
    cancelSubscription?.()

    cancelSubscription = createSubscription(newArgs)
  }, {
    immediate: true,
  })

  // cleanup subscription when component is unmounted
  onScopeDispose(() => cancelSubscription?.())

  return {
    data,
    error,
    isPending: computed(() => data.value === undefined),
    suspense,
  }
}
