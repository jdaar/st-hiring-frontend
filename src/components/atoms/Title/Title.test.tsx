import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Title } from './Title'

describe('Title', () => {
  it('is a level 1 heading by default', () => {
    renderWithTheme(<Title>Events</Title>)

    expect(screen.getByRole('heading', { level: 1, name: 'Events' })).toBeInTheDocument()
  })

  it.each([2, 3, 4, 5, 6] as const)('renders level %i as an h%i', (level) => {
    renderWithTheme(<Title level={level}>Events</Title>)

    expect(screen.getByRole('heading', { level })).toHaveProperty('tagName', `H${level}`)
  })

  it('keeps its level when it looks like another one', () => {
    renderWithTheme(
      <Title level={2} variant="h5">
        Events
      </Title>,
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('MuiTypography-h5')
  })
})
