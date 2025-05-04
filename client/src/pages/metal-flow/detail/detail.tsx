import { Sheet, Stack, Typography } from '@mui/joy'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { Detail, Material } from 'shared/domain'
import { EnUnit } from 'shared/enumerations'
import { apolloClient } from 'src/api'
import { MetalFlowSys } from 'src/lib/routes'
import {
  AddResourceButton,
  MyInput,
  SendMutation,
  TakeLookHint
} from 'src/shortcuts'
import * as gql from 'src/types/graphql-shema'
import {
  GetDetailsQuery,
  useGetMaterialsQuery,
  useInsertDetailMutation
} from 'src/types/graphql-shema'
import { PageTitle } from '../../../components'
import { Table } from '../../../components/table.impl'
import { EditIconButton, QtyInputWithUnit, SmallInputForm } from '../shared'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { ResourceName } from '../shared/material-name'
import { goTo } from '../spa'
import { t } from '../text'
import { useDetail } from './state'

type DetailDto = GetDetailsQuery['metal_pdo_details'][0]
const columnList: Column<DetailDto>[] = [
  {
    Header: 'Id',
    accessor: 'id'
  },
  {
    Header: t.DetailName,
    id: 'name',
    accessor: 'name'
  },
  {
    Header: t.Action,
    accessor: data => (
      <EditIconButton
        url={goTo(MetalFlowSys.detail_update, data.id)}
        title={t.EditDetail}
      />
    )
  }
]

export function MaterialWeightInput(props: { material: Material }) {
  const { material } = props
  const state = useDetail()

  return (
    <QtyInputWithUnit
      unitId={EnUnit.Gram}
      setValue={v => {
        material.weight = Number(v)
        state.updMaterialById(material.id, material)
      }}
      value={material.weight?.toString() || ''}
      label="Вес заготовки (гр)"
    />
  )
}

export function MatirialLengthInput(props: { material: Material }) {
  const { material } = props
  const state = useDetail()
  return (
    <QtyInputWithUnit
      unitId={EnUnit.MilliMeter}
      setValue={v => {
        material.length = Number(v)
        state.updMaterialById(material.id, material)
      }}
      value={material.length?.toString() || ''}
      label="Длина заготовки (мм)"
    />
  )
}

export function DetailMaterialPropInput() {
  const state = useDetail()
  return (
    <Stack>
      {state.materials.map(m => (
        <Stack sx={{ width: 'max-content' }} key={m.id}>
          <ResourceName resource={m.resourceName()} />
          <MaterialWeightInput material={m} />
          <MatirialLengthInput material={m} />
        </Stack>
      ))}
    </Stack>
  )
}

export function DetailsList() {
  const navigate = useNavigate()
  const { data } = gql.useGetDetailsQuery({ fetchPolicy: 'network-only' })

  return (
    <>
      <PageTitle title={t.DetailsList} hideIcon>
        <AddResourceButton navigateTo={goTo(MetalFlowSys.detail_add)} />
      </PageTitle>
      <Sheet>
        <Table
          columns={columnList}
          data={data?.metal_pdo_details || []}
          onDoubleRowClick={row =>
            navigate(goTo(MetalFlowSys.detail_update, row.id))
          }
        />
      </Sheet>
    </>
  )
}

export function DetailUpdateForm() {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) {
    return <>No id</>
  }

  const state = useDetail()
  const { data, refetch } = gql.useGetDetailByPkQuery({
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
  const [mutate] = gql.useUpdateDetailMutation()

  useEffect(() => {
    if (data) {
      state.unpack(data.metal_pdo_details_by_pk)
    }
  }, [data])

  const handleSave = async () => {
    await mutate({
      variables: {
        id: state.id,
        _set: {
          name: state.name
        }
      }
    })

    for (const m of state.materials) {
      const cost = state.materialCosts[m.id]

      await apolloClient.mutate<
        gql.UpdateDetailMaterialCostMutation,
        gql.UpdateDetailMaterialCostMutationVariables
      >({
        mutation: gql.UpdateDetailMaterialCostDocument,
        variables: {
          cost: Number(cost),
          detail_id: state.id,
          material_id: m.id
        }
      })
    }

    state.setRecentlyUpdated(new Detail(state.id, state.name, state.materials))
    setTimeout(() => refetch(), 1000)
  }

  return (
    <SmallInputForm
      header={t.EditDetail}
      last={<SendMutation onClick={handleSave} />}
    >
      <Stack gap={1}>
        <Typography>ID {state.id}</Typography>

        <MyInput
          label={t.DetailName}
          onChange={(event: any) => {
            state.setName(event.target.value)
          }}
          value={state.name}
          autoComplete="off"
        />

        <DetailMaterialPropInput />
      </Stack>
    </SmallInputForm>
  )
}

export function DetailAddForm() {
  const [mut, { data, reset }] = useInsertDetailMutation()

  const state = useDetail()
  const handleSave = async () => {
    const res = await mut({
      variables: {
        object: {
          name: state.name,
          detail_materials: {
            data: state.materials.map(each => ({
              material_id: each.id,
              cost: state.materialCosts[each.id]
            }))
          }
        }
      }
    })
    state.setRecentlyAdded(new Detail(state.id, state.name, state.materials))
    if (res.errors?.length) {
      throw Error(res.errors.join('\n'))
    }
    return res.data?.insert_metal_pdo_details_one?.id
  }

  const mutResult = data?.insert_metal_pdo_details_one?.id

  if (mutResult) {
    setTimeout(() => {
      reset()
    }, 5000)
  }

  const { data: materials } = useGetMaterialsQuery()

  return (
    <SmallInputForm
      header={t.AddDetail}
      last={
        <SendMutation
          onClick={async () =>
            handleSave().then(res => {
              state.reset()
              return res
            })
          }
          additionals={(err, res) => (
            <TakeLookHint
              text={t.RecentlyNewDetailAdded}
              link={goTo(MetalFlowSys.detail_update, res)}
            />
          )}
        />
      }
    >
      <MyInput
        label={t.DetailName}
        onChange={(event: any) => {
          state.setName(event.target.value)
        }}
        value={state.name}
        autoComplete="off"
      />

      <MaterialAutocompleteMulti
        data={materials}
        value={state.materials}
        onChange={m => state.setMaterials(m)}
      />

      <DetailMaterialPropInput />
    </SmallInputForm>
  )
}
