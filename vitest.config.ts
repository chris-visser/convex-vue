import type { ViteUserConfig } from 'vitest/config'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude!,
        'src/helpers/logger.ts',
      ],
    },
  },
}) as ViteUserConfig
