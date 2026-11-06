import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('is an indeterminate progressbar by default', () => {
    renderWithTheme(<ProgressBar aria-label="Loading" />)

    expect(screen.getByRole('progressbar', { name: 'Loading' })).not.toHaveAttribute('aria-valuenow')
  })

  it('reports its value when determinate', () => {
    renderWithTheme(<ProgressBar aria-label="Uploading" variant="determinate" value={40} />)

    expect(screen.getByRole('progressbar', { name: 'Uploading' })).toHaveAttribute('aria-valuenow', '40')
  })
})
