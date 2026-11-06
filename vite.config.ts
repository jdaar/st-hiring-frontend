import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@st-hiring/shared': fileURLToPath(
        new URL('../../packages/shared/src/index.ts', import.meta.url),
      ),
    },
  },
  server: {
    proxy: {
      '/v1': 'http://localhost:3000',
    },
  },
  test: {
    name: 'frontend',
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      // stories, test helpers, barrels and the bootstrap file are not app logic
      exclude: ['src/**/*.{test,stories}.{ts,tsx}', 'src/test/**', 'src/**/index.ts', 'src/main.tsx', 'src/**/*.d.ts'],
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportOnFailure: true,
    },
  },
})
