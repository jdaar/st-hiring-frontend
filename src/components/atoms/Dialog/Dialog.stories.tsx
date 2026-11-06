import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import { Button } from '../Button'
import { Paragraph } from '../Paragraph'
import { Dialog, DialogProps } from './Dialog'

// opened from a button like in the app; the dialog renders in a portal, so it is found through screen
const WithTrigger = (args: Pick<DialogProps, 'title' | 'onClose' | 'children'>) => {
  const [open, setOpen] = useState(false)
  const close = () => {
    args.onClose()
    setOpen(false)
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open
      </Button>
      <Dialog title={args.title} open={open} onClose={close} actions={<Button onClick={close}>Close</Button>}>
        {args.children}
      </Dialog>
    </>
  )
}

const meta = {
  title: 'Atoms/Dialog',
  component: Dialog,
  args: {
    open: false,
    title: 'Settings',
    onClose: fn(),
    children: <Paragraph>Changes apply to every new order.</Paragraph>,
  },
  render: (args) => <WithTrigger {...args} />,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const OpenAndClose: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }))
    const dialog = await screen.findByRole('dialog', { name: 'Settings' })
    await expect(dialog).toHaveTextContent('Changes apply to every new order.')

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

export const CloseWithEscape: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }))
    await screen.findByRole('dialog', { name: 'Settings' })

    await userEvent.keyboard('{Escape}')
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}
