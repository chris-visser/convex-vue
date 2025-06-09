import type { ConvexClient } from 'convex/browser'
import { inject } from 'vue'
import type { ConvexVueContext } from '../plugin'

/**
 * Returns the Convex client instance.
 */
export const useConvexClient = (): ConvexClient => {
  const convexVueContext = inject<ConvexVueContext>('convex')
  if (!convexVueContext)
    throw new Error('Context not found')

  if (!convexVueContext.clientRef.value)
    throw new Error('Client not initialized')

  return convexVueContext.clientRef.value
}
