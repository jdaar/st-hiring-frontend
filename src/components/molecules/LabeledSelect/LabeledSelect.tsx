import { ReactNode, forwardRef, useId } from 'react'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import { Label, Select, SelectProps } from '../../atoms'

export interface SelectOption {
  value: string
  label: ReactNode
}

export type LabeledSelectProps = Omit<SelectProps, 'error' | 'label' | 'ref' | 'children'> & {
  label: ReactNode
  options: SelectOption[]
  helperText?: ReactNode
  // a message replaces the helper text
  error?: boolean | string
}

export const LabeledSelect = forwardRef<HTMLDivElement, LabeledSelectProps>(
  ({ label, options, helperText, error = false, required, disabled, fullWidth, id, ...selectProps }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const labelId = `${selectId}-label`
    const helperId = `${selectId}-helper`
    const message = typeof error === 'string' ? error : helperText

    return (
      <FormControl ref={ref} error={Boolean(error)} required={required} disabled={disabled} fullWidth={fullWidth}>
        <Label id={labelId}>{label}</Label>
        <Select
          id={selectId}
          labelId={labelId}
          label={label}
          aria-describedby={message ? helperId : undefined}
          {...selectProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {message && <FormHelperText id={helperId}>{message}</FormHelperText>}
      </FormControl>
    )
  },
)

LabeledSelect.displayName = 'LabeledSelect'
