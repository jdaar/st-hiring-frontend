import * as yup from 'yup'
import { LabeledSwitch, LabeledSwitchProps } from '../../components/molecules'
import { useFormField } from '../use-form-field'

export type FormSwitchProps = Omit<LabeledSwitchProps, 'name' | 'checked' | 'onChange' | 'onBlur' | 'error'> & {
  name: string
  schema?: yup.Schema
}

export const FormSwitch = ({ name, schema, ...props }: FormSwitchProps) => {
  const { field, error } = useFormField<boolean>({ name, type: 'checkbox', schema })

  return (
    <LabeledSwitch
      {...props}
      name={name}
      checked={Boolean(field.checked)}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error ?? false}
    />
  )
}
