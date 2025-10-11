import {
  Box,
  Button,
  Container,
  ContainerProps,
  Stack,
  ToggleButtonGroup
} from '@mui/joy'
import { EnUnit, UiUnit } from 'models'

export function WorkPage(props: ContainerProps) {
  return (
    <Container
      {...props}
      sx={{
        ...props.sx,
        m: 0,
        overflow: 'scroll',
        px: '0px!important'
      }}
    >
      {props.children}
    </Container>
  )
}

export function MaterialUnitSelect(props: {
  value?: EnUnit
  onChange: (e: EnUnit) => void
}) {
  return (
    <Stack>
      <Label label="Ед. измерения" />
      <ToggleButtonGroup
        variant="outlined"
        color="primary"
        value={props.value ? Object.keys(EnUnit)[props.value] : null}
        onChange={(e, v) => {
          props.onChange(parseInt(v as any))
        }}
      >
        {Object.entries(UiUnit).map(([key, value]) => (
          <Button value={key} key={key} color="neutral">
            {value}
          </Button>
        ))}
      </ToggleButtonGroup>
    </Stack>
  )
}

import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import {
  DeleteResourceButton,
  ExecuteAction,
  Label,
  P,
  routeMap,
  Row
} from 'lib/index'

export function AlloyAutocomplete(props: {
  setAlloy: (alloy: string) => void
  alloy?: string
}) {
  const { setAlloy, alloy } = props
  const [alloys, setAlloys] = useState<string[]>([])
  useEffect(() => {
    rpc.pdo.material.getDistinctAlloys
      .query()
      .then(alloys => setAlloys(alloys.filter(Boolean) as string[]))
  }, [])

  const options: BaseOption[] =
    alloys.filter(Boolean).map(alloy => ({
      label: alloy,
      value: alloy
    })) || []

  return (
    <>
      <BaseAutocomplete
        label={'Сплав'}
        options={options}
        value={alloy ? { label: alloy, value: alloy } : null}
        onChange={newValue => {
          if (newValue && !Array.isArray(newValue)) {
            setAlloy(newValue.value)
          } else {
            setAlloy('')
          }
        }}
        freeSolo
        loading={alloys.length === 0}
      />
    </>
  )
}

import { SxProps } from '@mui/joy/styles/types'
import { DeleteConfirmDialog } from 'components/delete_confirm_dialog'
import {
  NavigationBar,
  Props as PageTitleProps
} from 'components/navigation_bar'
import { rpc } from 'lib/rpc.client'
import { ReactNode, useEffect, useState } from 'react'

/** Narrow container */
export function Narrow(props: ContainerProps) {
  return (
    <Container maxWidth="xs" sx={{ m: 0, p: 0 }} {...props}>
      {props.children}
    </Container>
  )
}

export const SaveAndDelete = (props: {
  itemName: string
  handleDelete: () => Promise<unknown>
  handleSave: () => Promise<unknown>
  sx?: SxProps
}) => {
  return (
    <Row alignItems={'end'} gap={2} sx={props.sx}>
      <DeleteConfirmDialog
        title={props.itemName}
        handleDelete={() => props.handleDelete()}
        button={<DeleteResourceButton />}
      />
      <ExecuteAction
        fullWidth
        onSubmit={() => props.handleSave()}
        stackProps={{ sx: { flexGrow: 1 } }}
        buttonProps={{
          size: 'sm'
        }}
      />
    </Row>
  )
}

export function WarehouseOperationsLinks(props: {
  onSupplyClick: () => void
  onWriteoffClick: () => void
}) {
  const { onSupplyClick, onWriteoffClick } = props
  return (
    <Row gap={1}>
      <Button color="primary" variant="soft" onClick={onSupplyClick}>
        Поставка
      </Button>
      <Button color="danger" variant="soft" onClick={onWriteoffClick}>
        Списание
      </Button>
    </Row>
  )
}

export function MetalPageTitle(props: PageTitleProps) {
  return (
    <NavigationBar
      {...props}
      homeUrl={routeMap.pdo.index}
      hideIcon
      spaceBetween
    />
  )
}

export function capitalize(text: string) {
  if (!text) return ''
  return text[0].toUpperCase() + text.slice(1)
}

export function ComplexTitle(props: {
  subtitle: string
  title: string | ReactNode
  index: number
}) {
  return (
    <Box>
      <P level="body-sm" whiteSpace={'nowrap'}>
        {props.subtitle} №{props.index}
      </P>
      <P whiteSpace={'nowrap'} color="primary" fontWeight={700} level="body-lg">
        {typeof props.title === 'string'
          ? capitalize(props.title)
          : props.title}
      </P>
    </Box>
  )
}
