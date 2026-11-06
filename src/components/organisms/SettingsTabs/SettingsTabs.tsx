import { useId, useState } from 'react'
import { Setting } from '@st-hiring/shared'
import { UpsertSettingVariables } from '../../../hooks/use-upsert-setting'
import { TabPanel, Tabs } from '../../atoms'
import { NewSettingForm } from '../NewSettingForm'
import { SettingsForm } from '../SettingsForm/SettingsForm'

export type SettingsTab = 'update' | 'new'

export interface SettingsTabsProps {
  settings: Setting[]
  onSave: (change: UpsertSettingVariables) => Promise<Setting>
  initialTab?: SettingsTab
}

const TABS = [
  { value: 'update' as const, label: 'Update' },
  { value: 'new' as const, label: 'New' },
]

// both panels stay mounted so switching keeps what was typed; a created setting is shown in the update tab
export const SettingsTabs = ({ settings, onSave, initialTab = 'update' }: SettingsTabsProps) => {
  const id = useId()
  const [tab, setTab] = useState<SettingsTab>(initialTab)

  const create = async (setting: UpsertSettingVariables) => {
    const created = await onSave(setting)
    setTab('update')
    return created
  }

  return (
    <>
      <Tabs id={id} tabs={TABS} value={tab} onChange={setTab} aria-label="Settings" sx={{ mb: 2 }} />
      <TabPanel id={id} value="update" hidden={tab !== 'update'}>
        <SettingsForm settings={settings} onSave={onSave} elevation={0} />
      </TabPanel>
      <TabPanel id={id} value="new" hidden={tab !== 'new'}>
        <NewSettingForm existingIds={settings.map((setting) => setting.id)} onCreate={create} elevation={0} />
      </TabPanel>
    </>
  )
}
