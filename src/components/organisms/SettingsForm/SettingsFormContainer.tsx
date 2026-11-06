import { useSettings } from '../../../hooks/use-settings'
import { useUpsertSetting } from '../../../hooks/use-upsert-setting'
import { toErrorMessage } from '../../../forms'
import { Button, Paragraph, ProgressBar } from '../../atoms'
import { Card } from '../Card'
import { SettingsTabs } from '../SettingsTabs'

// SettingsTabs on top of the settings hooks: optimistic list, retries and refetch after saving
export const SettingsFormContainer = () => {
  const { data, error, refetch } = useSettings()
  const { mutateAsync } = useUpsertSetting()

  if (error) {
    return (
      <Card title="Settings" actions={<Button onClick={() => void refetch()}>Retry</Button>}>
        <Paragraph role="alert" color="error">
          {toErrorMessage(error)}
        </Paragraph>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card title="Settings">
        <ProgressBar aria-label="Loading settings" />
      </Card>
    )
  }

  return <SettingsTabs settings={data} onSave={mutateAsync} />
}
