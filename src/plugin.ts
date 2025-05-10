import { ConvexClient } from 'convex/browser'
import type { ObjectPlugin } from 'vue'

export const convexVue: ObjectPlugin<{ url: string }> = {
  install(app, options) {
    if (!options?.url) {
      throw new Error('Convex URL is required')
    }
    if (typeof options.url !== 'string') {
      throw new Error('Convex URL must be a string')
    }
    
    const client = new ConvexClient(options.url)
    app.provide('convex', client)
  },
}
