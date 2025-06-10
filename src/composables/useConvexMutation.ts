import type { FunctionArgs, FunctionReference } from 'convex/server'
import type { MaybeRefOrGetter } from 'vue'
import { computed, ref, toValue } from 'vue'

import { useConvexClient } from './useConvexClient'

/**
 * Appliess a mutation to the Convex server.
 */
export function useConvexMutation<Mutation extends FunctionReference<'mutation'>>(mutationReference: Mutation) {
  const client = useConvexClient()
  const error = ref<Error | null>(null)
  const isPendingCount = ref(0)

  const mutate = async (args: MaybeRefOrGetter<FunctionArgs<Mutation>>) => {
    ++isPendingCount.value
    error.value = null

    return await client.mutation(mutationReference, toValue(args))
      .catch((e) => {
        error.value = e
        throw e
      })
      .finally(() => {
        --isPendingCount.value
      })
  }

  return {
    mutate,
    error,
    isPending: computed(() => Boolean(isPendingCount.value)),
  }
}
