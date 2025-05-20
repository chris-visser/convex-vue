import { ConvexHttpClient } from 'convex/browser'
import {
    type FunctionArgs,
    type FunctionReference,
  } from 'convex/server'
import {  type MaybeRefOrGetter,toValue } from 'vue'

import { useConvexClient } from './useConvexClient'

/**
 * A composable that returns a function to call a Convex query via the Convex HTTP API.
 * This is useful for server-side rendering or static site generation.
 */
export const useConvexHttpQuery = <Query extends FunctionReference<'query'>>(
  query: Query,
  args: MaybeRefOrGetter<FunctionArgs<Query>> = {},
) => {
    const client = useConvexClient()

    const httpClient = new ConvexHttpClient(client.client.url)

    if (!httpClient) {
      throw new Error('Convex HTTP client not found')
    }

    return httpClient.query(query, toValue(args))
}