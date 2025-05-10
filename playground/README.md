# Convex Vue Playground

This is a sample playground project for experimenting with the `convex-vue` integration. It demonstrates how to use Convex as a backend with a Vue 3 frontend, including real-time queries and composables.

## Features
- Vue 3 + Vite setup
- Convex backend integration
- Example Convex query (tasks list)
- TypeScript support

## Getting Started

### 1. Install dependencies

```bash
bun install # or npm install, yarn, pnpm
```

### 2. Start the Convex backend

```bash
bun run convex:dev # or npm run convex:dev
```

This will start the Convex backend locally and generate the API files.

### 3. Start the frontend

```bash
bun run dev # or npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure
- `src/` – Vue app source code
- `convex/` – Convex backend functions (see `tasks.ts` for example)
- `sampleData.jsonl` – Example data for tasks

## Example Usage
The main app (`src/App.vue`) shows how to use the `useConvexQuery` composable to fetch and display tasks from Convex in real time.

## Environment Variables
Set your Convex deployment URL in `.env.local`:

```
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

## License
MIT
