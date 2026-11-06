import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'storybook-static'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    ...vitest.configs.recommended,
  },
  {
    // the assertions live in each story's play function
    files: ['src/**/*.stories.test.tsx'],
    rules: { 'vitest/expect-expect': 'off' },
  },
  {
    // storybook config, not a component module
    files: ['.storybook/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
)
