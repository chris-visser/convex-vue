import type { ConvexClient } from 'convex/browser'
import type { ConvexVueContext } from '../plugin'
import { inject } from 'vue'

/**
 * Returns the Convex client instance.
 */
export function useConvexClient(): ConvexClient {
  const convexVueContext = inject<ConvexVueContext>('convex')
  if (!convexVueContext)
    throw new Error('Context not found')

  if (!convexVueContext.clientRef.value)
    throw new Error('Client not initialized')

  return convexVueContext.clientRef.value
}
