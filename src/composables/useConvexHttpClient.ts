import type { ConvexHttpClient } from 'convex/browser'
import { useConvexContext } from './useConvexContext'

/**
 * Returns the Convex HTTP client instance.
 */
export function useConvexHttpClient(): ConvexHttpClient {
  const convexVueContext = useConvexContext()

  if (!convexVueContext.httpClientRef.value)
    throw new Error('HTTP client not initialized')

  return convexVueContext.httpClientRef.value
}
