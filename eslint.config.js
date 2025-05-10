import oxlint from 'eslint-plugin-oxlint'
import vue from 'eslint-plugin-vue'
import js from '@eslint/js'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...tsPlugin.configs['flat/recommended'],
  ...oxlint.configs['flat/recommended'],
  {
    ignores: ['**/dist', '**/node_modules'],
  },
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue']
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    files: ['**/*.vue'],
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'sort-imports': ['error', {
        ignoreCase: true,
        allowSeparatedGroups: true
      }]
    }
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
    },
  },
]