import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Button } from '../../atoms'
import { ButtonGroup } from './ButtonGroup'

describe('ButtonGroup', () => {
  it('groups its buttons under a name, in order', async () => {
    const onNext = vi.fn()
    const { user } = renderWithTheme(
      <ButtonGroup aria-label="pagination">
        <Button>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </ButtonGroup>,
    )
    const group = screen.getByRole('group', { name: 'pagination' })

    expect(within(group).getAllByRole('button').map((button) => button.textContent)).toEqual(['Previous', 'Next'])

    await user.click(within(group).getByRole('button', { name: 'Next' }))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('disables every button when disabled', () => {
    renderWithTheme(
      <ButtonGroup aria-label="pagination" disabled>
        <Button>Previous</Button>
        <Button>Next</Button>
      </ButtonGroup>,
    )

    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
  })
})
