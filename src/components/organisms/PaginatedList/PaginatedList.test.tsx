import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { PaginatedList, PaginatedListProps } from './PaginatedList'

const renderList = (props: Partial<PaginatedListProps<string>> = {}) =>
  renderWithTheme(
    <PaginatedList<string>
      title="Fruits"
      items={['apple', 'banana']}
      getKey={(item) => item}
      renderItem={(item) => <span>{item}</span>}
      page={1}
      totalPages={3}
      onPageChange={vi.fn()}
      {...props}
    />,
  )

describe('PaginatedList', () => {
  it('renders each item through renderItem, in order', () => {
    renderList()

    expect(screen.getByRole('heading', { name: 'Fruits' })).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Fruits' })).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['apple', 'banana'])
  })

  it('reports the chosen page', async () => {
    const onPageChange = vi.fn()
    const { user } = renderList({ onPageChange })

    await user.click(screen.getByRole('button', { name: 'Go to page 3' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('hides the pagination when everything fits in one page', () => {
    renderList({ totalPages: 1 })

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('keeps the items while the next page loads', () => {
    renderList({ updating: true })

    expect(screen.getByRole('progressbar', { name: 'Loading page' })).toBeInTheDocument()
    const list = screen.getByRole('list', { name: 'Fruits' })
    expect(list).toHaveAttribute('aria-busy', 'true')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
  })

  it('shows the empty text, the loading state and the error instead of the list', async () => {
    const onRetry = vi.fn()
    renderList({ items: [], emptyText: 'No fruit' })
    expect(screen.getByText('No fruit')).toBeInTheDocument()

    renderList({ loading: true, title: 'Loading list' })
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument()

    const { user } = renderList({ error: 'It broke', onRetry, title: 'Broken list' })
    expect(screen.getByRole('alert')).toHaveTextContent('It broke')
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
