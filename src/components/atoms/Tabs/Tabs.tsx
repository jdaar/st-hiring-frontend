import { ReactNode, forwardRef } from 'react'
import MuiTabs, { TabsProps as MuiTabsProps } from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box, { BoxProps } from '@mui/material/Box'

export interface TabOption<T extends string> {
  value: T
  label: ReactNode
}

export type TabsProps<T extends string> = Omit<MuiTabsProps, 'value' | 'onChange' | 'children'> & {
  // prefix shared with the TabPanels so tabs and panels reference each other
  id: string
  tabs: TabOption<T>[]
  value: T
  onChange: (value: T) => void
}

const tabId = (id: string, value: string) => `${id}-tab-${value}`
const panelId = (id: string, value: string) => `${id}-panel-${value}`

export const Tabs = <T extends string>({ id, tabs, value, onChange, ...props }: TabsProps<T>) => (
  <MuiTabs value={value} onChange={(_event, next: T) => onChange(next)} {...props}>
    {tabs.map((tab) => (
      <Tab
        key={tab.value}
        value={tab.value}
        label={tab.label}
        id={tabId(id, tab.value)}
        aria-controls={panelId(id, tab.value)}
      />
    ))}
  </MuiTabs>
)

export type TabPanelProps = BoxProps & {
  id: string
  value: string
}

// content of the tab with the same id prefix and value
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(({ id, value, ...props }, ref) => (
  <Box ref={ref} role="tabpanel" id={panelId(id, value)} aria-labelledby={tabId(id, value)} {...props} />
))

TabPanel.displayName = 'TabPanel'
