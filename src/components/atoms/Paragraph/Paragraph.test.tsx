import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Paragraph } from './Paragraph'

describe('Paragraph', () => {
  it('renders a paragraph', () => {
    renderWithTheme(<Paragraph>Doors open at 8</Paragraph>)

    expect(screen.getByText('Doors open at 8')).toHaveProperty('tagName', 'P')
  })

  it.each([
    ['md', 'MuiTypography-body1'],
    ['sm', 'MuiTypography-body2'],
  ] as const)('uses the %s body size', (size, className) => {
    renderWithTheme(<Paragraph size={size}>Doors open at 8</Paragraph>)

    expect(screen.getByText('Doors open at 8')).toHaveClass(className)
  })
})
