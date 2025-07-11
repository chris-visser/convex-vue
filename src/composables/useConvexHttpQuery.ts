import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'
import type { MaybeRefOrGetter } from 'vue'
import { ConvexHttpClient } from 'convex/browser'
import { toValue } from 'vue'
import { useConvexClient } from './useConvexClient'

/**
 * A composable that returns a function to call a Convex query via the Convex HTTP API.
 * This is useful for server-side rendering or static site generation.
 */
export function useConvexHttpQuery<Query extends FunctionReference<'query'>>(query: Query, args: MaybeRefOrGetter<FunctionArgs<Query>> = {}): Promise<FunctionReturnType<Query>> {
  const client = useConvexClient()

  const httpClient = new ConvexHttpClient(client.client.url)

  if (!httpClient) {
    throw new Error('Convex HTTP client not found')
  }

  return httpClient.query(query, toValue(args))
}
