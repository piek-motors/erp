import { Button, Stack, ToggleButtonGroup } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { DeleteConfirmDialog } from 'components/delete_confirm_dialog'
import {
  NavigationBar,
  Props as PageTitleProps
} from 'components/navigation_bar'
import {
  ActionButton,
  DeleteResourceButton,
  Label,
  routeMap,
  Row
} from 'lib/index'
import { rpc } from 'lib/rpc/rpc.client'
import { UiUnit, Unit } from 'models'
import { useEffect, useState } from 'react'

export function MaterialUnitSelect(props: {
  value?: Unit
  onChange: (e: Unit) => void
}) {
  return (
    <Stack>
      <Label label="Ед. учета остатков" />
      <ToggleButtonGroup
        variant="outlined"
        color="neutral"
        value={props.value != null ? Object.keys(Unit)[props.value] : null}
        onChange={(e, v) => {
          props.onChange(parseInt(v as any))
        }}
      >
        {Object.entries(UiUnit).map(([key, value]) => (
          <Button value={key} key={key}>
            {value}
          </Button>
        ))}
      </ToggleButtonGroup>
    </Stack>
  )
}

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
          size: 'sm'
        }}
      />
      <DeleteConfirmDialog
        title={props.itemName}
        handleDelete={() => props.handleDelete()}
        button={<DeleteResourceButton />}
      />
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
