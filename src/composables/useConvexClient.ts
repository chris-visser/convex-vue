import type { ConvexClient } from 'convex/browser'
import { useConvexContext } from './useConvexContext'

/**
 * Returns the Convex client instance.
 */
export function useConvexClient(): ConvexClient {
  const convexVueContext = useConvexContext()

  if (!convexVueContext.clientRef.value)
    throw new Error('Client not initialized')

  return convexVueContext.clientRef.value
}
