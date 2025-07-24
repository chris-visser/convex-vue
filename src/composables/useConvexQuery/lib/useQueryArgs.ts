import type { OptionalRestArgsAndOptions } from '#src/types.ts'
import type { FunctionReference } from 'convex/server'
import type { UseConvexQueryOptions } from '../types'
import { computed, toValue } from 'vue'

/**
 * A composable that returns the query arguments and options for use in Convex queries.
 * It determines whether the query arguments are optional and provides a computed reference to the arguments and options.
 */
export function useQueryArgs<Query extends FunctionReference<'query'>>(rest: OptionalRestArgsAndOptions<Query, UseConvexQueryOptions>) {
  const args = computed(() => toValue(rest[0]))
  const options = rest[1]

  return { args, options }
}
