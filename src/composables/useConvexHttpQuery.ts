import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useConvexHttpClient } from './useConvexHttpClient'

/**
 * A composable that returns a function to call a Convex query via the Convex HTTP API.
 * This is useful for server-side rendering or static site generation.
 */
export function useConvexHttpQuery<Query extends FunctionReference<'query'>>(query: Query, args: MaybeRefOrGetter<FunctionArgs<Query>> = {}): Promise<FunctionReturnType<Query>> {
  const client = useConvexHttpClient()

  return client.query(query, toValue(args))
}
