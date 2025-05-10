import type { ConvexClient } from 'convex/browser'
import { inject } from 'vue'

/**
 * Returns the Convex client instance.
 */
export const useConvexClient = (): ConvexClient => {
  const convex = inject<ConvexClient>('convex')
  if (!convex) {
    throw new Error('Convex client not found')
  }
  return convex
}
