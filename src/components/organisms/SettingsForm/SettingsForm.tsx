import { ReactNode } from 'react'
import { FormikErrors, FormikHelpers } from 'formik'
import { Setting } from '@st-hiring/shared'
import { UpsertSettingVariables } from '../../../hooks/use-upsert-setting'
import { Form, FormActions, FormStatus, FormSwitch, FormTextField, toErrorMessage } from '../../../forms'
import { Paragraph } from '../../atoms'
import { Card } from '../Card'
import { SettingField, SettingsFormValues, toFormValues, toLabel, valueSchema } from './settings-form-values'

export interface SettingsFormProps {
  settings: Setting[]
  onSave: (change: UpsertSettingVariables) => Promise<Setting>
  title?: ReactNode
  subheader?: ReactNode
}

const SettingInput = ({ field, index }: { field: SettingField; index: number }) => {
  const name = `settings.${index}.value`
  const label = toLabel(field.id)
  const schema = valueSchema(field.savedValue)

  if (typeof field.savedValue === 'boolean') return <FormSwitch name={name} label={label} schema={schema} />
  return (
    <FormTextField
      name={name}
      label={label}
      schema={schema}
      type={typeof field.savedValue === 'number' ? 'number' : 'text'}
      fullWidth
    />
  )
}

export const SettingsForm = ({
  settings,
  onSave,
  title = 'Settings',
  subheader = 'Changes apply to new orders',
}: SettingsFormProps) => {
  if (settings.length === 0) {
    return (
      <Card title={title} subheader={subheader}>
        <Paragraph color="text.secondary">No settings yet.</Paragraph>
      </Card>
    )
  }

  // saves the changed settings in parallel with the version they were loaded with; each failure stays on its field
  const handleSubmit = async (values: SettingsFormValues, { resetForm }: FormikHelpers<SettingsFormValues>) => {
    const changed = values.settings.filter((field) => field.value !== field.savedValue)
    const results = await Promise.allSettled(
      changed.map(({ id, value, version }) => onSave({ id, value, version })),
    )
    const outcome = new Map(changed.map((field, index) => [field.id, results[index]]))

    const next = values.settings.map((field): SettingField => {
      const result = outcome.get(field.id)
      return result?.status === 'fulfilled'
        ? { ...field, value: result.value.value, savedValue: result.value.value, version: result.value.version }
        : field
    })
    const fieldErrors = values.settings.map((field) => {
      const result = outcome.get(field.id)
      return result?.status === 'rejected' ? { value: toErrorMessage(result.reason) } : undefined
    })
    const failed = fieldErrors.filter(Boolean).length

    resetForm({
      values: { settings: next },
      errors: failed ? ({ settings: fieldErrors } as FormikErrors<SettingsFormValues>) : {},
      touched: failed ? { settings: next.map(() => ({ value: true })) } : {},
      status: failed ? `${failed} of ${changed.length} changes could not be saved` : undefined,
    })
  }

  return (
    // remounts when settings are added or removed; plain refetches keep unsaved edits
    <Form key={settings.map(({ id }) => id).join('\n')} initialValues={toFormValues(settings)} onSubmit={handleSubmit}>
      {({ values, resetForm }) => (
        <Card
          title={title}
          subheader={subheader}
          actions={<FormActions onReset={() => resetForm({ values: toFormValues(settings) })} />}
        >
          {values.settings.map((field, index) => (
            <SettingInput key={field.id} field={field} index={index} />
          ))}
          <FormStatus />
        </Card>
      )}
    </Form>
  )
}
