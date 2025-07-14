import type { OptionalRestArgsOrSkip } from '#src/types.ts'
import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'

import type { MaybeRefOrGetter, Ref } from 'vue'

import {
  getFunctionName,
} from 'convex/server'
import { computed, onScopeDispose, ref, toValue, watch } from 'vue'
import { useConvexClient } from './useConvexClient'
import { useConvexContext } from './useConvexContext'
import { useConvexHttpClient } from './useConvexHttpClient'

export interface UseConvexQueryOptions {
  /**
   * Set to `false` to disable this query during server-side rendering.
   */
  server?: boolean
}

export type EmptyObject = Record<string, never>
export type OptionalRestArgsOrSkip<FuncRef extends FunctionReference<any>> = FuncRef['_args'] extends EmptyObject ? [args?: EmptyObject | undefined, opts?: UseConvexQueryOptions ] : [args: MaybeRefOrGetter<FuncRef['_args']>, opts?: UseConvexQueryOptions]

export interface UseConvexQueryReturn<Query extends FunctionReference<'query'>> {
  data: Ref<FunctionReturnType<Query> | undefined>
  error: Ref<Error | null>
  isPending: Ref<boolean>
  suspense: () => Promise<FunctionReturnType<Query>>
}

export function useConvexQuery<Query extends FunctionReference<'query'>>(query: Query, ...args: OptionalRestArgsOrSkip<Query>): UseConvexQueryReturn<Query> {

  const queryArgs = computed(() => toValue(args[0]))
  const opts = args[1]

  const convexContext = useConvexContext()
  const isServer = typeof window === 'undefined'
  const ssrEnabled = opts?.server ?? convexContext.options.server ?? true

  // server-side but ssr explicitly disabled
  if (isServer && !ssrEnabled) {
    return {
      data: ref(undefined),
      error: ref(null),
      isPending: ref(false),
      suspense: () => Promise.resolve(undefined),
    }
  }

  // use http client on server-side
  if (isServer) {
    const convex = useConvexHttpClient()

    const data = ref<FunctionReturnType<Query> | undefined>(undefined)
    const error = ref<Error | null>(null)

    // no need to watch queryArgs on server since reactivity is disabled during ssr
    const promise = convex.query(query, queryArgs.value).then((result) => {
      data.value = result
      error.value = null
      return result
    }).catch((err) => {
      data.value = undefined
      error.value = err
      throw err
    })

    return {
      data,
      error,
      isPending: computed(() => data.value === undefined),
      suspense: () => promise,
    }
  }

  const convex = useConvexClient()

  // Initial data
  const data: Ref<FunctionReturnType<Query> | undefined> = ref<FunctionReturnType<Query> | undefined>(convex.client.localQueryResult(getFunctionName(query), queryArgs.value))
  const error = ref<Error | null>(null)

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
