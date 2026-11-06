import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Button, Paragraph } from '../../atoms'
import { Card } from './Card'

describe('Card', () => {
  it('renders header, body and actions', async () => {
    const onSave = vi.fn()
    const { user } = renderWithTheme(
      <Card title="Settings" subheader="Applies to new orders" actions={<Button onClick={onSave}>Save</Button>}>
        <Paragraph>Body text</Paragraph>
      </Card>,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByText('Applies to new orders')).toBeInTheDocument()
    expect(screen.getByText('Body text')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('renders only the header when it has no body or actions', () => {
    renderWithTheme(<Card title="Settings" />)

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(document.querySelector('.MuiCardContent-root')).toBeNull()
  })
})
