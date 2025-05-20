import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import oxlint from 'eslint-plugin-oxlint'
import perfectionist from 'eslint-plugin-perfectionist'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'


export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...tsPlugin.configs['flat/recommended'],
  ...oxlint.configs['flat/recommended'],
  perfectionist.configs['recommended-natural'],
  {
    ignores: ['**/dist', '**/node_modules'],
  },
  {
    files: ['*.ts', '*.tsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser
      },
    },
  },
  {
    // files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser
      }
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
    }
  },
  {
    ...perfectionist.configs['recommended-natural'],
    rules: {
      ...perfectionist.configs['recommended-natural'].rules,
      'perfectionist/sort-imports': [
        'error',
        {

          // customGroups: [{
          //   elementNamePattern: '^vue$',
          //   groupName: 'vue',
          //   selector: 'import',
          // }],
          groups: [
            ['builtin', 'external', 'internal'],
          ],
          newlinesBetween: 'always',
        },
      ],
    },
  },
]