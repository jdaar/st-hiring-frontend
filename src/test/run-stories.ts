import { afterEach, describe, it } from 'vitest'
import { composeStories, setProjectAnnotations } from '@storybook/react-vite'
import type { MswParameter } from 'msw-storybook-addon/csf3'
import { unmountElement } from '@storybook/react-dom-shim'
import preview from '../../.storybook/preview'
import { server } from './server'

// the real preview (theme, store, query client); MSW's node server stands in for the browser-only loader
setProjectAnnotations({ ...preview, loaders: [] })

interface RunnableStory {
  run: (context: { canvasElement: HTMLElement }) => Promise<void>
  parameters: { msw?: MswParameter }
}

// composeStories loses its story types behind a generic module
const isRunnable = (story: unknown): story is RunnableStory =>
  typeof story === 'function' && 'run' in story && 'parameters' in story

const handlersOf = (msw: MswParameter | undefined) => {
  if (!msw) return []
  if (Array.isArray(msw)) return msw
  return Array.isArray(msw.handlers) ? msw.handlers : Object.values(msw.handlers ?? {}).flat()
}

// run() renders into document.body and never tears the previous story down, which leaves portals
// (open menus) behind for the next one; each story gets its own canvas, unmounted afterwards
let canvasElement: HTMLElement | undefined

afterEach(() => {
  if (canvasElement) unmountElement(canvasElement)
  canvasElement?.remove()
  canvasElement = undefined
})

// one test per story, running its play function
export const runStories = (title: string, stories: Parameters<typeof composeStories>[0]) =>
  describe(title, () => {
    for (const [name, story] of Object.entries(composeStories(stories))) {
      if (!isRunnable(story)) continue
      it(
        name,
        async () => {
          server.use(...handlersOf(story.parameters.msw))
          canvasElement = document.body.appendChild(document.createElement('div'))
          await story.run({ canvasElement })
        },
        15_000,
      )
    }
  })
