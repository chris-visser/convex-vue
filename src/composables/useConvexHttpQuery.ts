import {
    type FunctionArgs,
    type FunctionReference,
  } from 'convex/server'
import { inject, type MaybeRefOrGetter,toValue } from 'vue'

import { ConvexHttpClient } from '../plugin'

/**
 * A composable that returns a function to call a Convex query via the Convex HTTP API.
 * This is useful for server-side rendering or static site generation.
 */
export const useConvexHttpQuery = <Query extends FunctionReference<'query'>>(
  query: Query,
  args: MaybeRefOrGetter<FunctionArgs<Query>> = {},
) => {
    const httpClient = inject<ConvexHttpClient>('convex-http')

    if (!httpClient) {
      throw new Error('Convex HTTP client not found')
    }

    return httpClient.query(query, toValue(args))
}