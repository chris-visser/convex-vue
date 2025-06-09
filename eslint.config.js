import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // Type of the project. 'lib' | 'app' (default 'app')
    type: 'lib',

    // Customize the stylistic rules
    stylistic: {
      indent: 2, // 4, or 'tab'
      quotes: 'single', // or 'double'
    },

    // TypeScript and Vue are autodetected, you can also explicitly enable them:
    typescript: true,
    // vue: true,

    // ESLint ignore globs here
    ignores: [
      '**/convex/_generated/**',
    ],
  },
  {
    rules: {
      // Relaxes inline statements a bit
      'style/max-statements-per-line': ['error', { max: 2 }],
      'ts/explicit-function-return-type': 'off',
    },
  },
  // Allow trailing space for markdown formatting
  {
    files: ['**/*.md'],
    rules: {
      // // Experimental: allow multiple empty lines, this reduce conflicts AI Agents docs edits.
      // 'style/no-multiple-empty-lines': 'off',
      'style/no-trailing-spaces': 'off',
    },
  },
)
