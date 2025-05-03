import { UilArrowLeft, UilPen } from '@iconscout/react-unicons'

import { Box, IconButton, Sheet, Stack, Tooltip, Typography } from '@mui/joy'
import { NavigateOptions, To, useNavigate } from 'react-router-dom'
import { formatUnit } from 'shared'
import { MyInput } from 'src/shortcuts'
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
    <Box maxWidth="sm">
      <PageTitle title={props.header} />
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
    <Stack direction="row" alignItems="center" gap={1}>
      <MyInput
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
      <Typography>{formatUnit(unitId)}</Typography>
    </Stack>
  )
}

export function EditIconButton(props: { url: string; title: string }) {
  const navigate = useNavigate()
  return (
    <Tooltip title={props.title}>
      <IconButton
        size="sm"
        sx={{
          opacity: 0.2,
          '&:hover': {
            opacity: 1
          }
        }}
        onClick={() => navigate(props.url)}
      >
        <UilPen />
      </IconButton>
    </Tooltip>
  )
}
