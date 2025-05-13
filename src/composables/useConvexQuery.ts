import {
  type FunctionArgs,
  type FunctionReference,
  type FunctionReturnType,
  getFunctionName,
} from 'convex/server'
import { computed,type MaybeRef, type MaybeRefOrGetter, ref, toValue } from 'vue'

import { useConvexClient } from './useConvexClient'
import { useDeferredPromise } from './useDeferredPromise'

export type UseConvexQueryOptions = {
  enabled?: MaybeRef<boolean>;
}

export const useConvexQuery = <Query extends FunctionReference<'query'>>(
  query: Query,
  args: MaybeRefOrGetter<FunctionArgs<Query>> = {},
) => {
  const convex = useConvexClient()

  // Initial data
  const data = ref<FunctionReturnType<Query>>(
    convex.client.localQueryResult(getFunctionName(query), toValue(args)),
  )

  const error = ref<Error | null>()

  const { resolve, reject, suspense } =
    useDeferredPromise<FunctionReturnType<Query>>()

  const handleError = (err: Error) => {
    data.value = null
    error.value = err
    reject(err)
  }

  const handleResult = (result: FunctionReturnType<Query>) => {
    data.value = result
    error.value = null
    resolve(result)
  }

  if (typeof window !== 'undefined') {
    convex.onUpdate(
      query,
      toValue(args),
      handleResult,
      handleError,
    )
  } else {
    // On the server, subscriptions are not available, so we need to
    // call the query function directly to support SSR.
    convex.query(query, toValue(args))
    .then(handleResult)
    .catch(handleError)
  }

  return {
    suspense,
    data,
    error,
    isLoading: computed(() => data.value === undefined),
  }
}
