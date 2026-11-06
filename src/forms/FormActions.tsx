import { ReactNode } from 'react'
import { useFormikContext } from 'formik'
import { Button } from '../components/atoms'
import { ButtonGroup } from '../components/molecules'

export interface FormActionsProps {
  submitLabel?: ReactNode
  resetLabel?: ReactNode
  // replaces resetting to the initial values
  onReset?: () => void
}

export const FormActions = ({ submitLabel = 'Save', resetLabel = 'Discard', onReset }: FormActionsProps) => {
  const { isSubmitting, dirty, errors, resetForm } = useFormikContext()
  const hasErrors = Object.keys(errors).length > 0

  return (
    <ButtonGroup aria-label="form actions">
      <Button
        variant="outlined"
        disabled={isSubmitting || (!dirty && !hasErrors)}
        onClick={() => (onReset ? onReset() : resetForm())}
      >
        {resetLabel}
      </Button>
      <Button type="submit" variant="contained" disabled={!dirty} loading={isSubmitting}>
        {submitLabel}
      </Button>
    </ButtonGroup>
  )
}
