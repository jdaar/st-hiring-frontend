import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('marks the current page and reports the chosen one', async () => {
    const onChange = vi.fn()
    const { user } = renderWithTheme(<Pagination count={5} page={2} onChange={onChange} />)

    expect(screen.getByRole('button', { name: 'page 2' })).toHaveAttribute('aria-current', 'true')

    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(onChange).toHaveBeenCalledWith(expect.anything(), 3)
  })
})
