import type { FunctionArgs, FunctionReference } from "convex/server";
import { type MaybeRefOrGetter,ref,toValue,computed } from "vue";

import { useConvexClient } from "./useConvexClient";

/**
 * Appliess a mutation to the Convex server.
 */
export const useConvexMutation = <Mutation extends FunctionReference<'mutation'>>(mutationReference: Mutation) => {
    const client = useConvexClient();
    const isLoadingRef = ref(false);
    const errorRef = ref<Error | null>(null);

    const isLoading = computed(() => isLoadingRef.value);
    const error = computed(() => errorRef.value);

    const mutate = async (args: MaybeRefOrGetter<FunctionArgs<Mutation>>) => {
        isLoadingRef.value = true
        errorRef.value = null

        return client.mutation(mutationReference, toValue(args))
            .then((result) => {
                return { result }
            })
            .catch(err => {
                errorRef.value = err
                return { error: errorRef.value }
            })
            .finally(() => {
                isLoadingRef.value = false
            })
    }

    return { mutate, isLoading, error }
}