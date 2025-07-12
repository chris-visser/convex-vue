import type { ConvexVueContext } from '#src/plugin.ts'
import { inject } from 'vue'

/**
 * Returns the Convex plugin context
 */
export function useConvexContext(): ConvexVueContext {
  const convexVueContext = inject<ConvexVueContext>('convex-vue')
  if (!convexVueContext)
    throw new Error('Context not found')

  return convexVueContext
}
