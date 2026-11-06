import { ReactNode, forwardRef, useId } from 'react'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { Switch, SwitchProps } from '../../atoms'

export type LabeledSwitchProps = Omit<SwitchProps, 'error' | 'ref'> & {
  label: ReactNode
  helperText?: ReactNode
  // a message replaces the helper text
  error?: boolean | string
}

export const LabeledSwitch = forwardRef<HTMLDivElement, LabeledSwitchProps>(
  ({ label, helperText, error = false, required, disabled, id, inputProps, ...switchProps }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const helperId = `${inputId}-helper`
    const message = typeof error === 'string' ? error : helperText

    return (
      <FormControl ref={ref} error={Boolean(error)} required={required} disabled={disabled}>
        <FormControlLabel
          label={label}
          required={required}
          disabled={disabled}
          control={
            <Switch
              id={inputId}
              inputProps={{ ...inputProps, 'aria-describedby': message ? helperId : undefined }}
              {...switchProps}
            />
          }
        />
        {message && <FormHelperText id={helperId}>{message}</FormHelperText>}
      </FormControl>
    )
  },
)

LabeledSwitch.displayName = 'LabeledSwitch'
