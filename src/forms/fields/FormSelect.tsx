import * as yup from 'yup'
import { LabeledSelect, LabeledSelectProps } from '../../components/molecules'
import { useFormField } from '../use-form-field'

export type FormSelectProps = Omit<LabeledSelectProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error'> & {
  name: string
  schema?: yup.Schema
}

export const FormSelect = ({ name, schema, ...props }: FormSelectProps) => {
  const { field, error } = useFormField<string>({ name, schema })

  return (
    <LabeledSelect
      {...props}
      name={name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error ?? false}
    />
  )
}
