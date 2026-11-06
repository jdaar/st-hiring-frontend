import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Button } from '../Button'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('is a modal named by its title, with its content and actions', () => {
    renderWithTheme(
      <Dialog open title="Settings" onClose={() => {}} actions={<Button>Close</Button>}>
        Body
      </Dialog>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Settings' })

    expect(dialog).toHaveTextContent('Body')
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('renders nothing while closed', () => {
    renderWithTheme(
      <Dialog open={false} title="Settings" onClose={() => {}}>
        Body
      </Dialog>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('asks to close on escape', async () => {
    const onClose = vi.fn()
    const { user } = renderWithTheme(
      <Dialog open title="Settings" onClose={onClose}>
        Body
      </Dialog>,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })
})
