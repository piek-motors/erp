import { UilArrowLeft, UilPen } from '@iconscout/react-unicons'

import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { NavigateOptions, To, useNavigate } from 'react-router-dom'
import { formatUnit } from 'shared'
import { PaperL1 } from 'src/components/paper'
import { Btn, Input, P } from 'src/shortcuts'
import { PageTitle } from '../../components'
import { MetalFlowSys } from '../../lib/routes'
import { goTo } from './spa'
import { t } from './text'

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
  goBackUrl?: string
  goBackDelta?: number
  children: any
  beforeFormComp?: any
  lastSection?: JSX.Element
  nameComponent?: JSX.Element
}

export function SmallInputForm(props: FormProps) {
  return (
    <Box maxWidth="sm">
      <Stack direction="row" alignItems={'center'} gap={1} pb={2}>
        <PageTitle title={props.header} icon={<></>} />
      </Stack>
      <PaperL1
        sx={{
          p: 2,
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <PaperL1>
          <Stack>
            {props.nameComponent}
            {props.beforeFormComp}
            {props.children}
          </Stack>
          {props.lastSection && (
            <Stack pt={3} gap={2}>
              <Divider />
              {props.lastSection}
            </Stack>
          )}
        </PaperL1>
      </PaperL1>
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
      <Input
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
      <P>{formatUnit(unitId)}</P>
    </Stack>
  )
}

export function SavedHint(props: { show: any }) {
  if (props.show) {
    return <P>{t.Saved}</P>
  }
  return <></>
}

export function ErrorHint(props: { show: any; msg?: string; e?: Error }) {
  if (props.show) {
    return (
      <Box>
        <Typography color={'red'}>{props.msg}</Typography>
        <Typography color={'red'}>{JSON.stringify(props.e)}</Typography>
      </Box>
    )
  }
  return <></>
}

export function LoadingHint(props: { show: boolean }) {
  if (props.show) {
    return <P>Loading...</P>
  }
  return <></>
}

export function EditIconButton(props: { url: string; title: string }) {
  const navigate = useNavigate()

  return (
    <Tooltip title={props.title}>
      <Btn
        variant="iconic"
        size="small"
        color="secondary"
        onClick={() => navigate(props.url)}
      >
        <UilPen width={10} height={10} />
      </Btn>
    </Tooltip>
  )
}

export function ListPageHeader(props: {
  title: string
  btnText: string
  goto: MetalFlowSys
}) {
  const navigate = useNavigate()
  return (
    <Stack
      direction="row"
      alignItems={'center'}
      gap={0}
      pb={2}
      px={{ md: 0, xs: 1 }}
    >
      <PageTitle title={props.title} />
      <Btn
        sx={{ ml: 'auto' }}
        variant="contained"
        onClick={() => navigate(goTo(props.goto))}
      >
        {props.btnText}
      </Btn>
    </Stack>
  )
}
