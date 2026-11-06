import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, spyOn, userEvent } from 'storybook/test'
import { Markdown } from '../../atoms'
import { Expandable } from './Expandable'

const long = [
  '## World Tour 2026',
  'Doors open **one hour** before the show. Tickets are *non-refundable* but can be transferred.',
  '- All ages\n- Standing room only\n- Bag check at the entrance',
  '![Stage](https://picsum.photos/seed/stage/480/320)',
].join('\n\n')

// jsdom has no layout, so the measured content height is pinned
const contentHeight = (height: number) => () => {
  const spy = spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(height)
  return () => spy.mockRestore()
}

const meta = {
  title: 'Molecules/Expandable',
  component: Expandable,
  args: { collapsedHeight: 160, children: <Markdown>{long}</Markdown> },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}>{Story()}</div>],
} satisfies Meta<typeof Expandable>

export default meta
type Story = StoryObj<typeof meta>

export const Collapsed: Story = {
  beforeEach: contentHeight(600),
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: 'More...' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(document.getElementById(toggle.getAttribute('aria-controls') ?? '')).toHaveStyle({
      minHeight: '160px',
    })
  },
}

export const Expanded: Story = {
  beforeEach: contentHeight(600),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'More...' }))
    await expect(canvas.getByRole('button', { name: 'Less' })).toHaveAttribute('aria-expanded', 'true')
  },
}

export const CollapsedAgain: Story = {
  beforeEach: contentHeight(600),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'More...' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Less' }))
    await expect(canvas.getByRole('button', { name: 'More...' })).toHaveAttribute('aria-expanded', 'false')
  },
}

export const ShortContent: Story = {
  args: { children: <Markdown>{'Hello **world**'}</Markdown> },
  beforeEach: contentHeight(40),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('world')).toBeInTheDocument()
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    // its row is kept so a late overflow doesn't shift the layout
    await expect(canvas.getByRole('button', { hidden: true })).toHaveStyle({ visibility: 'hidden' })
  },
}
