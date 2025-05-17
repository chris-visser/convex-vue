import { ConvexClient as BaseConvexClient, ConvexHttpClient as BaseConvexHttpClient } from 'convex/browser'
import type { AuthTokenFetcher } from 'convex/react'
import type { ObjectPlugin } from 'vue'

interface ConvexAuthOptions {
  forceRefreshToken: boolean
}

export class ConvexHttpClient extends BaseConvexHttpClient {
  async setTokenFunc(fetcher: AuthTokenFetcher, options: ConvexAuthOptions) {
    const token = await fetcher(options)
    if(!token) {
      return
    }
    this.setAuth(token)
  }
}

export const convexVue: ObjectPlugin<{ url: string, auth: ConvexAuthOptions }> = {
  install(app, options) {
    if (!options?.url) {
      throw new Error('Convex URL is required')
    }
    if (typeof options.url !== 'string') {
      throw new Error('Convex URL must be a string')
    }
  
    const httpClient = new ConvexHttpClient(options.url)

    // Override the setAuth method so that when called it also sets the token on 
    // the httpClient. This simplifies the API for the user, where they only need to
    // call setAuth once and it will set it on both the ConvexClient and the ConvexHttpClient.
    // This is a bit of a hack, but it works.
    class ConvexClient extends BaseConvexClient {
      setAuth(fetcher: AuthTokenFetcher, onChange?: (isAuthenticated: boolean) => void) {
        super.setAuth(fetcher, onChange)
        httpClient.setTokenFunc(fetcher, options.auth)
      }
    }

    const client = new ConvexClient(options.url)

    app.provide('convex', client)
    app.provide('convex-http', httpClient)
  },
}
