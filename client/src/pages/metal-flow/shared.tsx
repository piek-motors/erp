import { Box, Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { uiUnit } from 'domain-model'
import { Inp, P } from 'lib/shortcuts'
import { JSX } from 'react'

interface FormProps {
  header: string
  children: any
  beforemain?: any
  last?: JSX.Element
  name?: JSX.Element
}

export function SmallInputForm(props: FormProps) {
  return (
    <Box maxWidth="sm" p={1}>
      <PageTitle title={props.header} hideIcon />
      <Stack gap={1}>
        {props.name}
        {props.beforemain}
        {props.children}
      </Stack>

      {props.last && (
        <Stack pt={2} gap={2}>
          {props.last}
        </Stack>
      )}
    </Box>
  )
}

export const QtyInputWithUnit = (props: {
  unitId?: number
  value?: string
  defaultValue?: string
  setValue: (num: string) => void
  label: string
}) => {
  const { unitId, value: qty, setValue: setQty } = props
  return (
    <Stack direction="row" alignItems="end" gap={1}>
      <Inp
        label={props.label}
        value={qty}
        onChange={v => {
          setQty(v)
        }}
        sx={{ width: 150 }}
        type="number"
      />
      <P pb={1}>{uiUnit(unitId)}</P>
    </Stack>
  )
}
