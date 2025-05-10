# Convex Vue

A Vue.js integration library for [Convex](https://convex.dev) - the backend application platform with a built-in database.

## Installation

```bash
# npm
npm install convex-vue

# yarn
yarn add convex-vue

# pnpm
pnpm add convex-vue

# bun
bun add convex-vue
```

## Usage

### Setup

```js
import { createApp } from 'vue'
import { convexVuePlugin } from 'convex-vue'
import App from './App.vue'

const app = createApp(App)

app.use(convexVuePlugin, {
  url: 'your-convex-deployment-url'
})

app.mount('#app')
```

### Composables

#### useConvexClient

```js
import { useConvexClient } from 'convex-vue'

// In your component
const client = useConvexClient()
```

#### useConvexQuery

```js
import { useConvexQuery } from 'convex-vue'
import { api } from '../convex/_generated/api'

// In your component or composable
const { data, isLoading, error } = useConvexQuery(api.myModule.myQuery, { param: 'value' })
```

**Suspense and SSR Support**

By default when using `useConvexQuery`, the data property will be undefined until the query is complete.
By using the suspense function, you can await the result of the query. This is useful for server-side rendering (SSR) 
and Static Site Generation (SSG) where you want to wait for the query to complete before rendering the component.


Convex subscriptions on the server are not supported. `useConvexQuery` therefore triggers a standard query. 
If you await the suspense function, it will resolve when the query is complete or reject with an error.

```tsx
// In your component or composable
const { data, suspense } = useConvexQuery(api.myModule.myQuery, { param: 'value' })

const result = await suspense()
// Now you can use the data or result
console.log(data)
console.log(result)
```

Either use the result of the suspense function like below, or simply use the data property. 
The suspense function will only return the result once on server and client (like a normal promise).
The data property will be reactive and update when the query result changes on the client.
Recommended to use the data property for SSR support and realtime clientside updates.

## License

MIT