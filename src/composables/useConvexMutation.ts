import type { FunctionArgs, FunctionReference } from "convex/server";
import { type MaybeRefOrGetter,toValue } from "vue";

import { useConvexClient } from "./useConvexClient";

/**
 * Appliess a mutation to the Convex server.
 */
export const useConvexMutation = <Mutation extends FunctionReference<'mutation'>>(mutationReference: Mutation) => {
    const client = useConvexClient();

    const mutation = (args: MaybeRefOrGetter<FunctionArgs<Mutation>>) => {
        return client.mutation(mutationReference, toValue(args));
    }

    return mutation
}