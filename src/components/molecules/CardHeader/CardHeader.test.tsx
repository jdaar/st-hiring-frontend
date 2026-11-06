import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Button } from '../../atoms'
import { CardHeader } from './CardHeader'

describe('CardHeader', () => {
  it('renders the title as a level 2 heading by default, with its subheader', () => {
    renderWithTheme(<CardHeader title="Settings" subheader="Applies to new orders" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByText('Applies to new orders')).toHaveProperty('tagName', 'P')
  })

  it('uses the given heading level', () => {
    renderWithTheme(<CardHeader title="Settings" titleLevel={3} />)

    expect(screen.getByRole('heading', { level: 3, name: 'Settings' })).toBeInTheDocument()
  })

  it('renders its action', () => {
    renderWithTheme(<CardHeader title="Settings" action={<Button>Refresh</Button>} />)

    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
  })
})
