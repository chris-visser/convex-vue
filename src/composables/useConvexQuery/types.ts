import type { FunctionReference, FunctionReturnType } from 'convex/server'
import type { Ref } from 'vue'

export interface UseConvexQueryOptions {
  /**
   * Set to `false` to disable this query during server-side rendering.
   */
  server?: boolean
}

export interface UseConvexQueryReturn<Query extends FunctionReference<'query'>> {
  data: Ref<FunctionReturnType<Query> | undefined>
  error: Ref<Error | null>
  isPending: Ref<boolean>
  suspense: () => Promise<FunctionReturnType<Query>>
  refetch: () => Promise<FunctionReturnType<Query>>
}

export interface UseConvexQueryReturn<Query extends FunctionReference<'query'>> {
  data: Ref<FunctionReturnType<Query> | undefined>
  error: Ref<Error | null>
  isPending: Ref<boolean>
  suspense: () => Promise<FunctionReturnType<Query>>
  refetch: () => Promise<FunctionReturnType<Query>>
}
