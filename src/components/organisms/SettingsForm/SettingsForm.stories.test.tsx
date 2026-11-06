import { describe, it } from 'vitest'
import { composeStories, setProjectAnnotations } from '@storybook/react-vite'
import type { MswParameter } from 'msw-storybook-addon/csf3'
import preview from '../../../../.storybook/preview'
import { server } from '../../../test/server'
import * as formStories from './SettingsForm.stories'
import * as connectedStories from './SettingsFormContainer.stories'

// runs every story's play function; MSW's node server stands in for the browser-only service worker loader
setProjectAnnotations({ ...preview, loaders: [] })

const handlersOf = (msw: MswParameter | undefined) => {
  if (!msw) return []
  if (Array.isArray(msw)) return msw
  return Array.isArray(msw.handlers) ? msw.handlers : Object.values(msw.handlers ?? {}).flat()
}

describe('SettingsForm stories', () => {
  for (const [name, Story] of Object.entries(composeStories(formStories))) {
    it(name, () => Story.run())
  }
})

describe('SettingsForm/Connected stories', () => {
  for (const [name, Story] of Object.entries(composeStories(connectedStories))) {
    it(
      name,
      async () => {
        server.use(...handlersOf(Story.parameters.msw))
        await Story.run()
      },
      15_000,
    )
  }
})
