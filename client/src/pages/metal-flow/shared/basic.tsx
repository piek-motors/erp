import {
  Button,
  Container,
  ContainerProps,
  Stack,
  ToggleButtonGroup
} from '@mui/joy'
import { EnUnit, UiUnit } from 'domain-model'

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
    <Stack gap={1}>
      <Label label="Единицы измерения" />
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
            <Button value={key} key={key}>
              {value}
            </Button>
          )
        })}
      </ToggleButtonGroup>
    </Stack>
  )
}

import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { ErrorHint, Label } from 'lib/shortcuts'
import { useGetPossibleAlloysQuery } from 'types/graphql-shema'
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

import { Autocomplete } from '@mui/joy'
import { Detail } from 'domain-model'
import { useGetDetailsQuery } from 'types/graphql-shema'
import { map } from '../mappers'

export function DetailSelect(props: {
  value?: Detail
  onChange: (value: Detail) => void
}) {
  const details = useGetDetailsQuery()
  const options =
    details.data?.metal_flow_details.map(each => ({
      label: each.name,
      data: map.detail.fromDto(each)
    })) || []

  return (
    <Autocomplete
      onChange={(_, selected) => {
        if (selected?.data) {
          props.onChange(selected.data)
        }
      }}
      getOptionLabel={option => option.label}
      options={options}
      isOptionEqualToValue={(option, value) =>
        option.data?.id === value.data?.id
      }
    />
  )
}

/** Narrow container */
export function Narrow(props: ContainerProps) {
  return (
    <Container maxWidth="xs" sx={{ m: 0, p: 0 }} {...props}>
      {props.children}
    </Container>
  )
}
