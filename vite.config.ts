import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// dev needs inline scripts for the react refresh preamble and websockets for hmr; emotion injects <style> tags
const securityHeaders = (dev: boolean) => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    `script-src 'self'${dev ? " 'unsafe-inline'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://picsum.photos https://fastly.picsum.photos",
    "font-src 'self'",
    `connect-src 'self'${dev ? ' ws:' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
})

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@st-hiring/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url)),
    },
  },
  server: {
    headers: securityHeaders(command === 'serve'),
    // same origin through the proxy, nothing needs cross-origin access to the dev server
    cors: false,
    proxy: {
      '/v1': 'http://localhost:3000',
    },
  },
  preview: {
    headers: securityHeaders(false),
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
}))
