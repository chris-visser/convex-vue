import type { FunctionReference, FunctionReturnType } from 'convex/server'
import type { UseConvexQueryOptions, UseConvexQueryReturn } from '../types.ts'
import { useConvexContext } from '#src/composables/useConvexContext.ts'
import { useConvexHttpClient } from '#src/composables/useConvexHttpClient.ts'
import { computed, ref } from 'vue'

/**
 * A composable that provides the server-side implementation of a Convex query. The output equals that of
 * `useConvexQuery`, but it does not support reactivity. It should only be used on the server side.
 */
export function useServerQuery<Query extends FunctionReference<'query'>>(query: Query, args: Query['_args'], options?: UseConvexQueryOptions): UseConvexQueryReturn<Query> {
  const convex = useConvexHttpClient()
  const convexContext = useConvexContext()

  const isServer = typeof window === 'undefined'

  if (!isServer) {
    throw new Error('useServerQuery should only be called on the server side')
  }

  const isServerDisabled = options?.server ?? convexContext.options.server ?? true

  if (isServerDisabled) {
    return {
      data: ref(undefined),
      error: ref(null),
      isPending: ref(false),
      suspense: () => Promise.resolve(undefined),
      refetch: () => Promise.resolve(undefined),
    }
  }

  const data = ref<FunctionReturnType<Query> | undefined>(undefined)
  const error = ref<Error | null>(null)

  const executeQuery = () => {
    return convex.query(query, args.value).then((result) => {
      data.value = result
      error.value = null
      return result
    }).catch((err) => {
      data.value = undefined
      error.value = err
      throw err
    })
  }

  // no need to watch queryArgs on server since reactivity is disabled during ssr
  const promise = executeQuery()

  return {
    data,
    error,
    isPending: computed(() => data.value === undefined),
    suspense: () => promise,
    refetch: executeQuery,
  }
}
