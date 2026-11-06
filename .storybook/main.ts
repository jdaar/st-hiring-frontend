import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', 'msw-storybook-addon'],
  framework: '@storybook/react-vite',
  // mockServiceWorker.js for msw-storybook-addon, kept out of the app build
  staticDirs: ['./public'],
  core: { disableTelemetry: true },
}

export default config
