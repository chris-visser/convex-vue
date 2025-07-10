import type { ConvexClient, ConvexHttpClient } from 'convex/browser'
import type { ConvexVueContext } from '../plugin'
import { inject } from 'vue'

/**
 * Returns the Convex client instance.
 */
export function useConvexClient(): ConvexClient {
  const convexVueContext = inject<ConvexVueContext>('convex-vue')
  if (!convexVueContext)
    throw new Error('Context not found')

  if (!convexVueContext.clientRef.value)
    throw new Error('Client not initialized')

  return convexVueContext.clientRef.value
}

/**
 * Returns the Convex HTTP client instance.
 */
export function useConvexHttpClient(): ConvexHttpClient {
  const convexVueContext = inject<ConvexVueContext>('convex-vue')
  if (!convexVueContext)
    throw new Error('Context not found')

  if (!convexVueContext.httpClientRef.value)
    throw new Error('HTTP client not initialized')

  return convexVueContext.httpClientRef.value
}
