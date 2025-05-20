import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: ['./src/index'],
  externals: [
    'vue',
    'convex',
    '@vue/shared'
  ],
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true
    }
  },
})