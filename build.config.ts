import type { BuildConfig } from 'obuild'
import { defineBuildConfig } from 'obuild/config'

export default defineBuildConfig({
  entries: [
    {
      type: 'bundle',
      input: 'src/index.ts',
    },
  ],
}) as BuildConfig
