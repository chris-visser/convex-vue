<div align="center">

<h1>Convex Vue</h1>

<h3>Convex integration for Vue!</h3>
<!-- <img src="./branding.svg" alt="Project's branding image" width="320"/> -->

</div>

# convex-vue ![TypeScript heart icon](https://img.shields.io/badge/♡-%23007ACC.svg?logo=typescript&logoColor=white)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Codecov][codecov-src]][codecov-href]
[![Bundlejs][bundlejs-src]][bundlejs-href]

* [convex-vue ](#convex-vue-)
  * [Overview](#overview)
  * [Features](#features)
  * [Usage](#usage)
    * [Install package](#install-package)
    * [Import and use](#import-and-use)
    * [Composables](#composables)
      * [useConvexClient](#useconvexclient)
      * [useConvexQuery](#useconvexquery)
      * [useConvexMutation](#useconvexmutation)
      * [Suspense and SSR Support](#suspense-and-ssr-support)
  * [License](#license)

## Overview

**convex-vue** is a Vue.js integration library for [Convex](https://convex.dev) - the backend application platform with a built-in database.

## Features

+ 👌 Supports Convex realtime queries
+ 🔄️ SSR and SSG support via suspense

## Usage

### Install package

```sh
# npm
npm install convex-vue

# bun
bun add convex-vue

# pnpm (recommended)
pnpm install convex-vue
```

### Import and use

Convex Vue is a Vue 3 plugin. Simply add it to your Vue app and use the provided composables.

```js
import { convexVue } from 'convex-vue'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(convexVue, {
  url: 'your-convex-deployment-url'
})

app.mount('#app')
```

### Composables

#### useConvexClient

The `useConvexClient` composable provides access to the Convex client instance. You can use it to call Convex functions directly or implement custom logic.

```js
import { useConvexClient } from 'convex-vue'

// In your component
const client = useConvexClient()
```

#### useConvexQuery

The `useConvexQuery` composable is used to fetch data from Convex. It automatically handles subscriptions and reactivity, so your components will update in real time when the data changes.  
On the server, it will trigger a standard query (without subscription).

```js
import { useConvexQuery } from 'convex-vue'
import { api } from '../convex/_generated/api'

// In your component or composable
const { data, isLoading, error } = useConvexQuery(api.myModule.myQuery, { param: 'value' })
```

#### useConvexMutation

The `useConvexMutation` composable is used to call Convex mutations. It provides a function that you can call to trigger the mutation, and it automatically handles loading and error states.

```js
import { useConvexMutation } from 'convex-vue'
import { api } from '../convex/_generated/api'
// In your component or composable
const { mutate, isLoading, error } = useConvexMutation(api.myModule.myMutation)

async function handleClick() {
  // mutate returns a promise with an object that contains a result or error property
  const { result, error: mutationError } = mutate({ param: 'value' })
}
```

#### Suspense and SSR Support

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

[![License][license-src]][license-href]

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/convex-vue?labelColor=18181B&color=F0DB4F
[npm-version-href]: https://npmjs.com/package/convex-vue
[npm-downloads-src]: https://img.shields.io/npm/dm/convex-vue?labelColor=18181B&color=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/convex-vue
[codecov-src]: https://img.shields.io/codecov/c/gh/chris-visser/convex-vue/main?labelColor=18181B&color=F0DB4F
[codecov-href]: https://codecov.io/gh/chris-visser/convex-vue
[license-src]: https://img.shields.io/github/license/chris-visser/convex-vue.svg?labelColor=18181B&color=F0DB4F
[license-href]: https://github.com/chris-visser/convex-vue/blob/main/LICENSE
[bundlejs-src]: https://img.shields.io/bundlejs/size/convex-vue?labelColor=18181B&color=F0DB4F
[bundlejs-href]: https://bundlejs.com/?q=convex-vue
