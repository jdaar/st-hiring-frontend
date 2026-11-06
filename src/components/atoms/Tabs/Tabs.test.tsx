import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { TabPanel, Tabs } from './Tabs'

const tabs = [
  { value: 'update', label: 'Update' },
  { value: 'new', label: 'New' },
]

describe('Tabs', () => {
  it('marks the current tab as selected', () => {
    renderWithTheme(<Tabs id="settings" tabs={tabs} value="update" onChange={() => {}} />)

    expect(screen.getByRole('tab', { name: 'Update' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'New' })).toHaveAttribute('aria-selected', 'false')
  })

  it('reports the value of the clicked tab', async () => {
    const onChange = vi.fn()
    const { user } = renderWithTheme(<Tabs id="settings" tabs={tabs} value="update" onChange={onChange} />)

    await user.click(screen.getByRole('tab', { name: 'New' }))
    expect(onChange).toHaveBeenCalledWith('new')
  })

  it('links each tab to the panel with the same id and value', () => {
    renderWithTheme(
      <>
        <Tabs id="settings" tabs={tabs} value="new" onChange={() => {}} />
        <TabPanel id="settings" value="new">
          New setting
        </TabPanel>
      </>,
    )

    expect(screen.getByRole('tabpanel', { name: 'New' })).toHaveTextContent('New setting')
    expect(screen.getByRole('tab', { name: 'New' })).toHaveAttribute('aria-controls', 'settings-panel-new')
  })
})
