import { Box, Tooltip, type TooltipProps } from '@mui/joy'
import type { SxProps } from '@mui/joy/styles/types'
import { UiUnit, Unit, uiUnit } from 'models'
import { useEffect, useState } from 'react'
import {
  BaseAutocomplete,
  type BaseOption,
} from '@/components/base-autocomplete'
import { DeleteConfirmDialog } from '@/components/delete_confirm_dialog'
import {
  NavTopBar,
  type Props as PageTitleProps,
} from '@/components/nav_topbar'
import { EnumSelect } from '@/components/select'
import { ActionButton, DeleteIcon, P, Row } from '@/lib/index'
import { rpc } from '@/lib/rpc/rpc.client'
import { MobileNavModal } from '../root_layout'

export function UnitSelect(props: {
  value?: Unit
  onChange: (e: Unit) => void
  disabled?: boolean
}) {
  return (
    <EnumSelect
      enum={Unit}
      label="Ед. учета остатков"
      size="sm"
      value={props.value}
      onChange={v => {
        props.onChange(parseInt(v as any))
      }}
      labels={UiUnit}
    />
  )
}

export function AlloyAutocomplete(props: {
  on_change: (alloy: string) => void
  value: string
}) {
  const { on_change: setAlloy, value: alloy } = props
  const [alloys, setAlloys] = useState<string[]>([])
  useEffect(() => {
    rpc.pdo.material.dict_distinct_alloys
      .query()
      .then(alloys => setAlloys(alloys.filter(Boolean) as string[]))
  }, [])

  const options: BaseOption[] =
    alloys.filter(Boolean).map(alloy => ({
      label: alloy,
      value: alloy,
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

export const SaveAndDelete = (props: {
  itemName: string
  handleDelete: () => Promise<unknown>
  handleSave: () => Promise<unknown>
  sx?: SxProps
}) => {
  return (
    <Row alignItems={'end'} gap={2} sx={props.sx}>
      <ActionButton
        fullWidth
        onClick={() => props.handleSave()}
        props={{
          size: 'sm',
        }}
      />
      <DeleteConfirmDialog
        title={props.itemName}
        handleDelete={() => props.handleDelete()}
        button={<DeleteIcon />}
      />
    </Row>
  )
}

export const MetalPageTitle = (props: PageTitleProps) => (
  <NavTopBar
    {...props}
    mobileMenuButton={<MobileNavModal />}
    hideIcon
    spaceBetween
  />
)

export function capitalize(text: string) {
  if (!text) return ''
  return text[0].toUpperCase() + text.slice(1)
}

export const value_with_unit = (
  value: string | number | null,
  unit: Unit | null,
) =>
  Boolean(value) && (
    <Row gap={0.5} flexWrap="nowrap">
      <P>{value}</P>
      {unit != null && <P level="body-xs">{uiUnit(unit)}</P>}
    </Row>
  )

export const Indicator = (props: {
  title: string
  color: string
  placement?: TooltipProps['placement']
}) => (
  <Tooltip title={props.title} size="sm" placement={props.placement ?? 'right'}>
    <Box width={12} height={12} bgcolor={props.color} borderRadius={12} />
  </Tooltip>
)
