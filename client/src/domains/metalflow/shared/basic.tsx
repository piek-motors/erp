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
  value: EnUnit
  onChange: (e: EnUnit) => void
}) {
  return (
    <Stack>
      <Label label="Ед. измерения" />
      <ToggleButtonGroup
        variant="plain"
        color="primary"
        value={props.value.toString()}
        onChange={(e, v) => {
          props.onChange(parseInt(v as any))
        }}
      >
        {Object.entries(UiUnit).map(([key, value]) => {
          return (
            <Button value={key} key={key} color="neutral">
              {value}
            </Button>
          )
        })}
      </ToggleButtonGroup>
    </Stack>
  )
}

import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import {
  DeleteResourceButton,
  ErrorHint,
  ExecuteAction,
  Label,
  P,
  routeMap,
  Row
} from 'lib/index'
import { useGetPossibleAlloysQuery } from 'lib/types/graphql-shema'
import { t } from '../text'

export function AlloyAutocomplete(props: {
  setAlloy: (alloy: string) => void
  alloy?: string
}) {
  const { setAlloy, alloy } = props
  const { data, loading, error } = useGetPossibleAlloysQuery()

  const options: BaseOption[] =
    Array.from(new Set(data?.metal_flow_materials?.map(e => e.shape_data)))
      .filter(Boolean)
      .map(alloy => ({
        label: alloy,
        value: alloy
      })) || []

  return (
    <>
      <ErrorHint e={error} />
      <BaseAutocomplete
        label={t.Alloy}
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
        loading={loading}
      />
    </>
  )
}

import { DeleteConfirmDialog } from 'components/delete_confirm_dialog'
import {
  NavigationBar,
  Props as PageTitleProps
} from 'components/navigation_bar'
import { ReactNode } from 'react'

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
}) => {
  return (
    <Row alignItems={'end'}>
      <DeleteConfirmDialog
        title={props.itemName}
        handleDelete={() => props.handleDelete()}
        button={<DeleteResourceButton />}
      />
      <ExecuteAction
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
      homeUrl={routeMap.metalflow.index}
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
