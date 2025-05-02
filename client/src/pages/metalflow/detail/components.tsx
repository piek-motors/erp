import { Stack } from '@mui/material'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Detail, Material } from 'shared/domain'
import { EnUnit } from 'shared/enumerations'
import { apolloClient } from 'src/api'
import { PaperL1 } from 'src/components/paper'
import { MetalFlowSys } from 'src/lib/routes'
import { Input, P } from 'src/shortcuts'
import * as gql from 'src/types/graphql-shema'
import {
  useGetMaterialsQuery,
  useInsertDetailMutation
} from 'src/types/graphql-shema'
import { ListPageHeader, QtyInputWithUnit, SmallInputForm } from '../shared'
import { MutationWithStatus, TakeLookHint } from '../shared/basic'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { Table } from '../shared/table.impl'
import { goTo } from '../spa'
import { t } from '../text'
import { columnList } from './columns.decl'
import { useDetail } from './state'

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
        <Stack sx={{ width: 'max-content' }}>
          <P variant="body1" px={1} pt={1}>
            {m.getIdentifier()}
          </P>
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
      <ListPageHeader
        title={t.DetailsList}
        btnText={t.AddDetail}
        goto={MetalFlowSys.detail_add}
      />
      <PaperL1>
        <Table
          columns={columnList}
          data={data?.metal_pdo_details || []}
          onDoubleRowClick={row =>
            navigate(goTo(MetalFlowSys.detail_update, row.id))
          }
        />
      </PaperL1>
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
      goBackUrl={MetalFlowSys.details}
      lastSection={<MutationWithStatus mutation={handleSave} />}
    >
      <Stack
        gap={1}
        sx={{
          display: 'flex'
        }}
      >
        <P>ID {state.id}</P>

        <Input
          label={t.DetailName}
          onChange={(event: any) => {
            state.setName(event.target.value)
          }}
          value={state.name}
          autoComplete={'off'}
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

  const actionSection = (
    <MutationWithStatus
      customComponent={(err, res) => (
        <TakeLookHint
          text={t.RecentlyNewDetailAdded}
          link={goTo(MetalFlowSys.detail_update, res)}
        />
      )}
      mutation={async () =>
        handleSave().then(res => {
          state.reset()
          return res
        })
      }
    />
  )

  const { data: materials } = useGetMaterialsQuery()

  return (
    <SmallInputForm
      header={t.AddDetail}
      goBackUrl={MetalFlowSys.details}
      lastSection={actionSection}
    >
      <Input
        label={t.DetailName}
        onChange={(event: any) => {
          state.setName(event.target.value)
        }}
        value={state.name}
        autoComplete={'off'}
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
