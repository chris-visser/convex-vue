import type { FunctionArgs, FunctionReference } from 'convex/server'
import type { MaybeRefOrGetter } from 'vue'
import { ref, toValue } from 'vue'

import { useConvexClient } from './useConvexClient'

/**
 * Appliess a mutation to the Convex server.
 */
export function useConvexMutation<Mutation extends FunctionReference<'mutation'>>(mutationReference: Mutation) {
  const client = useConvexClient()
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const mutate = async (args: MaybeRefOrGetter<FunctionArgs<Mutation>>) => {
    isLoading.value = true
    error.value = null

    return client.mutation(mutationReference, toValue(args))
      .then((result) => {
        return { result }
      })
      .catch((err) => {
        error.value = err
        return { error: error.value }
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  return { error, isLoading, mutate }
}
