import { ref } from 'vue'

export interface UseDeferredPromiseProps {
  timeoutMs?: number
}

/**
 * Returns a promise object with resolve and reject methods separately.
 * This is useful for creating promises that can be resolved or rejected later.
 */
export const useDeferredPromise = <T = void>({ timeoutMs = 5000 }: UseDeferredPromiseProps = {}) => {
  const isSettled = ref(false)

  let resolveFn: (value: T | PromiseLike<T>) => void
  let rejectFn: (reason?: unknown) => void

  const promise = new Promise<T>((resolve, reject) => {
    resolveFn = resolve
    rejectFn = reject
  })

  setTimeout(() => {
    if (!isSettled.value) {
      isSettled.value = true
      rejectFn(new Error('Deferred promise not resolved within timeout'))
    }
  }, timeoutMs)

  const resolve = (value: T) => {
    if (!isSettled.value) {
      isSettled.value = true
      resolveFn(value)
    }
  }

  const reject = (reason?: unknown) => {
    if (!isSettled.value) {
      isSettled.value = true
      rejectFn(reason)
    }
  }

  return {
    suspense: () => promise,
    resolve,
    reject,
    isSettled,
  }
}
