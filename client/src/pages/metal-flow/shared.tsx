import { UilArrowLeft } from '@iconscout/react-unicons'
import { Box, IconButton, Sheet, Stack, Typography } from '@mui/joy'
import { uiUnit } from 'domain-model'
import { JSX } from 'react'
import { NavigateOptions, To, useNavigate } from 'react-router-dom'
import { Inp } from 'shortcuts'
import { PageTitle } from '../../components'

type GoBackBtnProps = { to?: To; options?: NavigateOptions; delta?: number }
export const GoBackBtn = (props: GoBackBtnProps) => {
  const navigate = useNavigate()
  return (
    <Box>
      <IconButton
        onClick={() => {
          if (props.delta) {
            navigate(props.delta!)
          } else {
            if (!props.to) {
              throw Error('GoBackBtn props "to" were not passed')
            }
            navigate(props.to!, props.options)
          }
        }}
      >
        <UilArrowLeft />
      </IconButton>
    </Box>
  )
}

interface FormProps {
  header: string
  children: any
  beforemain?: any
  last?: JSX.Element
  name?: JSX.Element
}

export function SmallInputForm(props: FormProps) {
  return (
    <Box maxWidth="sm" p={2}>
      <PageTitle title={props.header} hideIcon />
      <Sheet sx={{ p: 2 }}>
        <Stack>
          {props.name}
          {props.beforemain}
          {props.children}
        </Stack>

        {props.last && (
          <Stack pt={2} gap={2}>
            {props.last}
          </Stack>
        )}
      </Sheet>
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
        autoComplete="off"
        label={props.label}
        value={qty}
        defaultValue={props.defaultValue}
        onChange={e => {
          setQty(e.target.value)
        }}
        type="number"
        fullWidth
      />
      <Typography pb={1}>{uiUnit(unitId)}</Typography>
    </Stack>
  )
}
