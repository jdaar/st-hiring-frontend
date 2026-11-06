import { ReactNode, forwardRef, useId } from 'react'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { Input, InputProps, Label } from '../../atoms'

export type LabeledInputProps = Omit<InputProps, 'error' | 'label' | 'ref'> & {
  label: ReactNode
  helperText?: ReactNode
  // a message replaces the helper text
  error?: boolean | string
}

// FormControl passes error/required/disabled/focus state to the label, input and helper text
export const LabeledInput = forwardRef<HTMLDivElement, LabeledInputProps>(
  ({ label, helperText, error = false, required, disabled, fullWidth, id, ...inputProps }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const helperId = `${inputId}-helper`
    const message = typeof error === 'string' ? error : helperText

    return (
      <FormControl ref={ref} error={Boolean(error)} required={required} disabled={disabled} fullWidth={fullWidth}>
        <Label htmlFor={inputId}>{label}</Label>
        <Input id={inputId} label={label} aria-describedby={message ? helperId : undefined} {...inputProps} />
        {message && <FormHelperText id={helperId}>{message}</FormHelperText>}
      </FormControl>
    )
  },
)

LabeledInput.displayName = 'LabeledInput'
