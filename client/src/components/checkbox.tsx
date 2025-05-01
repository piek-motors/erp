import MuiCheckbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'

export interface CheckboxProps {
  title: string
  value: boolean
  onClick: () => void
}

export function Checkbox(props: CheckboxProps) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<MuiCheckbox value={props.value} onClick={props.onClick} />}
        label={props.title}
      />
    </FormGroup>
  )
}
