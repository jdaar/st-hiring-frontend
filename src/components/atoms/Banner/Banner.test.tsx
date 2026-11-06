import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Banner } from './Banner'

describe('Banner', () => {
  it('announces its message as informational by default', () => {
    renderWithTheme(<Banner>Doors open at 8</Banner>)

    expect(screen.getByRole('alert')).toHaveTextContent('Doors open at 8')
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardInfo')
  })

  it('shows a title above the message', () => {
    renderWithTheme(<Banner title="Heads up">Doors open at 8</Banner>)

    expect(screen.getByText('Heads up')).toHaveClass('MuiAlertTitle-root')
  })

  it.each(['success', 'warning', 'error'] as const)('uses the %s severity', (severity) => {
    renderWithTheme(<Banner severity={severity}>Doors open at 8</Banner>)

    expect(screen.getByRole('alert')).toHaveClass(`MuiAlert-standard${severity[0].toUpperCase()}${severity.slice(1)}`)
  })
})
