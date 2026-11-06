import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Expandable } from './Expandable'

const contentHeight = (height: number) => vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(height)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Expandable', () => {
  it('shows short content whole, capped from the start, with the toggle row reserved but hidden', () => {
    contentHeight(100)
    renderWithTheme(<Expandable collapsedHeight={160}>Doors open at 8</Expandable>)
    const toggle = screen.getByRole('button', { hidden: true })

    expect(screen.getByText('Doors open at 8')).toBeVisible()
    expect(document.getElementById(toggle.getAttribute('aria-controls') ?? '')).toHaveStyle({ minHeight: '100px' })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(toggle).toHaveStyle({ visibility: 'hidden' })
    expect(toggle).toHaveAttribute('tabindex', '-1')
  })

  it('clips tall content until expanded, and collapses it again', async () => {
    contentHeight(400)
    const { user } = renderWithTheme(<Expandable collapsedHeight={160}>Long description</Expandable>)
    const toggle = screen.getByRole('button', { name: 'More...' })
    const region = document.getElementById(toggle.getAttribute('aria-controls') ?? '')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(region).toHaveStyle({ minHeight: '160px' })
    expect(region).toContainElement(screen.getByText('Long description'))

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Less' })).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: 'Less' }))
    expect(screen.getByRole('button', { name: 'More...' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('re-measures when the content resizes', () => {
    let resize = () => {}
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const height = contentHeight(100)
    renderWithTheme(<Expandable collapsedHeight={160}>Description with an image</Expandable>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    height.mockReturnValue(400)
    act(resize)
    expect(screen.getByRole('button', { name: 'More...' })).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
})

describe('Expandable growing content', () => {
  it('stays collapsed while its content grows past the cap', () => {
    let resize = () => {}
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const height = contentHeight(100)
    renderWithTheme(<Expandable collapsedHeight={160}>Description with an image</Expandable>)
    const region = document.getElementById(
      screen.getByRole('button', { hidden: true }).getAttribute('aria-controls') ?? '',
    )
    expect(region).toHaveStyle({ minHeight: '100px' })
    expect(region).not.toHaveClass('MuiCollapse-entered')

    height.mockReturnValue(600)
    act(resize)

    expect(region).toHaveStyle({ minHeight: '160px' })
    expect(region).not.toHaveClass('MuiCollapse-entered')
    expect(screen.getByRole('button', { name: 'More...' })).toHaveAttribute('aria-expanded', 'false')
    vi.unstubAllGlobals()
  })
})
