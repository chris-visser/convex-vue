import type { ConvexClientOptions } from 'convex/browser'
import type { ObjectPlugin, Ref } from 'vue'
import { ConvexClient, ConvexHttpClient } from 'convex/browser'
import { shallowRef } from 'vue'

export interface ConvexAuthOptions {
  forceRefreshToken: boolean
}

export interface ConvexVueOptions {
  url: string
  clientOptions?: ConvexClientOptions
  auth?: ConvexAuthOptions

  /**
   * If true, the global default client wont be initialized automatically,
   * you will need to init the client yourself before using the composables.
   */
  manualInit?: boolean
  /**
   * Set to `false` to disable queries during server-side rendering.
   * This global option can be overridden for individual queries by setting their `server` option to `true`
   */
  server?: boolean
}

export interface ConvexVueContext {
  options: ConvexVueOptions
  clientRef: Ref<ConvexClient | undefined>
  httpClientRef: Ref<ConvexHttpClient | undefined>

  /**
   * (Re-)init the global convex client with specified options.
   */
  initClient: (url: string, options?: ConvexClientOptions) => void
}

export const convexVue: ObjectPlugin<ConvexVueOptions> = {
  install(app, options) {
    const clientRef = shallowRef<ConvexClient>()
    const httpClientRef = shallowRef<ConvexHttpClient>()

    const initClient = (url: string, options?: ConvexClientOptions): void => {
      clientRef.value = new ConvexClient(url, options)
      httpClientRef.value = new ConvexHttpClient(url, {
        logger: options?.logger,
        skipConvexDeploymentUrlCheck: options?.skipConvexDeploymentUrlCheck,
      })
    }

    if (!options.manualInit)
      initClient(options.url, options.clientOptions)

    app.provide<ConvexVueContext>('convex-vue', {
      options,
      clientRef,
      httpClientRef,
      initClient,
    })
  },
}
