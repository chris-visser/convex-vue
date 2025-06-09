import type { ObjectPlugin, Ref } from 'vue'
import { ConvexClient } from 'convex/browser'
import { ref } from 'vue'

export interface ConvexAuthOptions {
  forceRefreshToken: boolean
}

export interface ConvexVueOptions {
  url: string
  auth?: ConvexAuthOptions

  /**
   * If true, the global default client wont be initialized automatically,
   * you will need to init the client yourself before using the composables.
   */
  manualInit?: boolean
}

export interface ConvexClientOptions {
  url: string
}

export interface ConvexVueContext {
  options: ConvexVueOptions
  clientRef: Ref<ConvexClient | undefined>

  /**
   * (Re-)init the global convex client with specified options.
   */
  initClient: (options: ConvexClientOptions) => void
}

export const convexVue: ObjectPlugin<ConvexVueOptions> = {
  install(app, options) {
    const clientRef = ref<ConvexClient>()
    const initClient = (options: ConvexClientOptions): void => {
      if (!options?.url) {
        throw new Error('"url" is required')
      }
      if (typeof options.url !== 'string') {
        throw new TypeError('"url" must be a string')
      }

      clientRef.value = new ConvexClient(options.url)
    }

    if (!options.manualInit)
      initClient(options)

    app.provide<ConvexVueContext>('convex', {
      options,
      clientRef,
      initClient,
    })
  },
}
