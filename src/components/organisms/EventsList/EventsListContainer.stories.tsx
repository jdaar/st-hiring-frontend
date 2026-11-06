import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { EventsBackendOptions, createEventsBackend } from '../../../test/handlers'
import { makeEvent } from '../../../test/fixtures'
import { EventsListContainer } from './EventsListContainer'

// usePaginatedEvents (redux page, prefetching, retries) against an in-memory /v1/events served by MSW
const events = Array.from({ length: 25 }, (_, index) => makeEvent(index + 1))

const connected = (options: EventsBackendOptions = {}, data = events) => {
  const backend = createEventsBackend(data, { latency: 400, ...options })
  return { parameters: { msw: { handlers: backend.handlers } }, beforeEach: backend.reset }
}

const SLOW = { timeout: 10_000 }

const meta = {
  title: 'Organisms/PaginatedList/Connected',
  component: EventsListContainer,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EventsListContainer>

export default meta
type Story = StoryObj<typeof meta>

// the next page is prefetched, so moving to it shows it right away
export const Loaded: Story = {
  ...connected(),
  play: async ({ canvas, step }) => {
    await step('first page', async () => {
      await expect(await canvas.findByRole('heading', { name: 'Event 1' }, SLOW)).toBeInTheDocument()
      await expect(canvas.getByText('25 events')).toBeInTheDocument()
      await expect(within(canvas.getByRole('list', { name: 'Upcoming events' })).getAllByRole('listitem')).toHaveLength(10)
    })

    await step('next page', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Go to next page' }))
      await expect(await canvas.findByRole('heading', { name: 'Event 11' }, SLOW)).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'page 2' })).toHaveAttribute('aria-current', 'true')
    })

    await step('last page', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Go to page 3' }))
      await expect(await canvas.findByRole('heading', { name: 'Event 21' }, SLOW)).toBeInTheDocument()
      await expect(within(canvas.getByRole('list', { name: 'Upcoming events' })).getAllByRole('listitem')).toHaveLength(5)
    })
  },
}

// jumping past the prefetched page keeps the current one on screen, marked busy, until it arrives
export const SlowPages: Story = {
  ...connected({ latency: 1500 }),
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: 'Event 1' }, SLOW)

    await userEvent.click(canvas.getByRole('button', { name: 'Go to page 3' }))

    await expect(await canvas.findByRole('progressbar', { name: 'Loading page' })).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: 'Event 1' })).toBeInTheDocument()
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Event 21' })).toBeInTheDocument(), SLOW)
    await expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument()
  },
}

// a 503 is retried three times before the error shows
export const ServerDown: Story = {
  ...connected({ failGet: 503, latency: 100 }),
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('alert', {}, SLOW)).toHaveTextContent('Internal server error')
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeEnabled()
  },
}

export const Empty: Story = {
  ...connected({}, []),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('No upcoming events.', {}, SLOW)).toBeInTheDocument()
    await expect(canvas.queryByRole('navigation')).not.toBeInTheDocument()
  },
}

export const Loading: Story = {
  ...connected({ latency: 'infinite' }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument()
  },
}
