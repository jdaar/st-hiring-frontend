import * as yup from 'yup'
import { LabeledInput, LabeledInputProps } from '../../components/molecules'
import { useFormField } from '../use-form-field'

export type FormTextFieldProps = Omit<LabeledInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error'> & {
  name: string
  schema?: yup.Schema
}

// number inputs are parsed to numbers by Formik, an emptied one becomes ''
export const FormTextField = ({ name, schema, ...props }: FormTextFieldProps) => {
  const { field, error } = useFormField<string | number>({ name, schema })

  return (
    <LabeledInput
      {...props}
      name={name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error ?? false}
    />
  )
}
