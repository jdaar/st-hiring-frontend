import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Paragraph } from '../Paragraph'
import { TabPanel, Tabs, TabsProps } from './Tabs'

type Value = 'update' | 'new'

const tabs = [
  { value: 'update' as const, label: 'Update' },
  { value: 'new' as const, label: 'New' },
]

// controlled like in the app, showing the panel of the selected tab
const WithPanels = (args: TabsProps<Value>) => {
  const [value, setValue] = useState(args.value)

  return (
    <>
      <Tabs
        {...args}
        value={value}
        onChange={(next) => {
          args.onChange(next)
          setValue(next)
        }}
      />
      <TabPanel id={args.id} value={value} sx={{ pt: 2 }}>
        <Paragraph>{value === 'update' ? 'Edit the existing settings' : 'Add a new setting'}</Paragraph>
      </TabPanel>
    </>
  )
}

const meta = {
  title: 'Atoms/Tabs',
  component: Tabs<Value>,
  args: { id: 'settings', tabs, value: 'update', onChange: fn() },
  render: (args) => <WithPanels {...args} />,
} satisfies Meta<typeof Tabs<Value>>

export default meta
type Story = StoryObj<typeof meta>

export const SwitchTabs: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('tabpanel', { name: 'Update' })).toHaveTextContent('Edit the existing settings')

    await userEvent.click(canvas.getByRole('tab', { name: 'New' }))
    await expect(args.onChange).toHaveBeenCalledWith('new')
    await expect(canvas.getByRole('tab', { name: 'New' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel', { name: 'New' })).toHaveTextContent('Add a new setting')
  },
}
