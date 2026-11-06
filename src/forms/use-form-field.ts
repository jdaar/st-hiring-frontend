import { FieldHookConfig, useField } from 'formik'
import * as yup from 'yup'

const validateWith = (schema: yup.Schema) => async (value: unknown) => {
  try {
    await schema.validate(value)
    return undefined
  } catch (error) {
    if (error instanceof yup.ValidationError) return error.message
    throw error
  }
}

// useField plus optional field level yup rules; error is only exposed once the field was touched
export const useFormField = <V>(config: FieldHookConfig<V> & { schema?: yup.Schema }) => {
  const { schema, ...fieldConfig } = config
  const [field, meta, helpers] = useField<V>({ ...fieldConfig, validate: schema && validateWith(schema) })

  return { field, helpers, error: meta.touched && meta.error ? meta.error : undefined }
}
