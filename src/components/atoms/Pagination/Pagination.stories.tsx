import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Pagination } from './Pagination'

const meta = {
  title: 'Atoms/Pagination',
  component: Pagination,
  args: { count: 10, page: 1, onChange: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'outlined'] },
    shape: { control: 'inline-radio', options: ['circular', 'rounded'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Go to page 2' }))
    await expect(args.onChange).toHaveBeenCalledWith(expect.anything(), 2)
  },
}

export const Outlined: Story = { args: { variant: 'outlined', shape: 'rounded', page: 4 } }

export const Disabled: Story = { args: { disabled: true } }
