import { ReactNode } from 'react'
import { FormikHelpers } from 'formik'
import * as yup from 'yup'
import { ApplicationError, Setting, SettingAlreadyExistsError, SettingValue } from '@st-hiring/shared'
import { UpsertSettingVariables } from '../../../hooks/use-upsert-setting'
import { Form, FormActions, FormSelect, FormStatus, FormSwitch, FormTextField, toErrorMessage } from '../../../forms'
import { Card } from '../Card'

export type SettingType = 'text' | 'number' | 'boolean'

export interface NewSettingFormProps {
  // keys already taken
  existingIds: string[]
  onCreate: (setting: UpsertSettingVariables) => Promise<Setting>
  title?: ReactNode
  subheader?: ReactNode
}

// one value per type, so switching type keeps what was typed in each
export interface NewSettingFormValues {
  id: string
  type: SettingType
  text: string
  number: number | ''
  boolean: boolean
}

const initialValues: NewSettingFormValues = { id: '', type: 'text', text: '', number: '', boolean: false }

const TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'On / off' },
]

const valueOf = ({ type, text, number, boolean }: NewSettingFormValues): SettingValue =>
  type === 'boolean' ? boolean : type === 'number' ? Number(number) : text.trim()

// the backend answers a taken key with a 409 carrying SettingAlreadyExistsError's code
const isAlreadyExists = (error: unknown) => {
  if (!(error instanceof ApplicationError)) return false
  const { code }: ApplicationError = error
  return code === SettingAlreadyExistsError.code
}

const idSchema = (existingIds: string[]) =>
  yup
    .string()
    .trim()
    .required('Required')
    .matches(/^[A-Za-z][\w-]*$/, 'Letters, digits, "-" or "_", starting with a letter')
    .notOneOf(existingIds, 'A setting with this key already exists')

export const NewSettingForm = ({
  existingIds,
  onCreate,
  title = 'New setting',
  subheader = 'Available as soon as it is added',
}: NewSettingFormProps) => {
  const handleSubmit = async (values: NewSettingFormValues, helpers: FormikHelpers<NewSettingFormValues>) => {
    try {
      await onCreate({ id: values.id.trim(), value: valueOf(values) })
      helpers.resetForm()
    } catch (error) {
      if (isAlreadyExists(error)) helpers.setFieldError('id', toErrorMessage(error))
      else helpers.setStatus(toErrorMessage(error))
    }
  }

  return (
    <Form initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values }) => (
        <Card title={title} subheader={subheader} actions={<FormActions submitLabel="Add setting" resetLabel="Clear" />}>
          <FormTextField name="id" label="Key" helperText="e.g. maxTicketsPerOrder" schema={idSchema(existingIds)} fullWidth />
          <FormSelect name="type" label="Type" options={TYPE_OPTIONS} fullWidth />
          {values.type === 'text' && (
            <FormTextField name="text" label="Value" schema={yup.string().trim().required('Required')} fullWidth />
          )}
          {values.type === 'number' && (
            <FormTextField
              name="number"
              label="Value"
              type="number"
              schema={yup.number().typeError('Must be a number').required('Required')}
              fullWidth
            />
          )}
          {values.type === 'boolean' && <FormSwitch name="boolean" label="Value" />}
          <FormStatus />
        </Card>
      )}
    </Form>
  )
}
