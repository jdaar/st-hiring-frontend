import FormHelperText from '@mui/material/FormHelperText'
import { useFormikContext } from 'formik'

// form level message, set with setStatus / resetForm({ status }); styled like the field errors
export const FormStatus = () => {
  const status: unknown = useFormikContext().status

  return typeof status === 'string' && status ? (
    <FormHelperText error role="alert">
      {status}
    </FormHelperText>
  ) : null
}
