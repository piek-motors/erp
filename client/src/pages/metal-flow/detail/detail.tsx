import { Sheet, Stack, Typography } from '@mui/joy'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { Material } from 'shared/domain'
import { EnUnit } from 'shared/enumerations'
import { MetalFlowSys } from 'src/lib/routes'
import {
  AddResourceButton,
  MyInput,
  Row,
  SendMutation,
  TakeLookHint
} from 'src/shortcuts'
import * as gql from 'src/types/graphql-shema'
import { GetDetailsQuery, useGetMaterialsQuery } from 'src/types/graphql-shema'
import { PageTitle } from '../../../components'
import { Table } from '../../../components/table.impl'
import { map } from '../mappers'
import { QtyInputWithUnit, SmallInputForm } from '../shared'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { ResourceName } from '../shared/material-name'
import { goTo } from '../spa'
import { t } from '../text'
import { handleInsertDetail, handleUpdateDetail } from './mutations'
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
  }
]

function MaterialWeightInput(props: { material: Material }) {
  const { material } = props
  const state = useDetail()
  const relationData = state.materials.get(material)
  return (
    <>
      <QtyInputWithUnit
        label="Вес заготовки"
        unitId={EnUnit.Gram}
        setValue={v => {
          state.updMaterialRelationData(material.id, { weight: v })
        }}
        value={relationData ? relationData.weight?.toString() : ''}
      />
      <QtyInputWithUnit
        label="Длина заготовки"
        unitId={EnUnit.MilliMeter}
        setValue={v => {
          state.updMaterialRelationData(props.material.id, { length: v })
        }}
        value={state.materials.get(props.material)?.length?.toString() || ''}
      />
    </>
  )
}

function DetailMaterialRelationForm() {
  const state = useDetail()
  return (
    <Sheet>
      <Stack my={1} gap={2}>
        {state.materials
          .entries()
          .map(([k, v]) => k)
          .map(m => (
            <Stack sx={{ width: 'max-content' }} key={m.id}>
              <Row sx={{ fontWeight: 'bold' }}>
                <Typography>Материал</Typography>
                <ResourceName resource={m.resourceName()} />
              </Row>
              <Stack p={1}>
                <MaterialWeightInput material={m} />
              </Stack>
            </Stack>
          ))}
      </Stack>
    </Sheet>
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
  if (!id) return <>No id</>
  const state = useDetail()
  const { data, refetch } = gql.useGetDetailByPkQuery({
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
  const detail = map.detail.fromDto(data?.metal_pdo_details_by_pk)
  useEffect(() => {
    if (detail) {
      state.unpack(detail)
    }
  }, [data])

  return (
    <SmallInputForm
      header={t.EditDetail}
      last={
        <SendMutation
          onClick={() => handleUpdateDetail(state).then(() => refetch())}
        />
      }
    >
      <Stack gap={1}>
        <Typography>ID {state.detailID}</Typography>
        <MyInput
          label={t.DetailName}
          onChange={(event: any) => {
            state.setName(event.target.value)
          }}
          value={state.name}
          autoComplete="off"
        />
        <DetailMaterialRelationForm />
      </Stack>
    </SmallInputForm>
  )
}

export function DetailAddForm() {
  const state = useDetail()
  const { data: materials } = useGetMaterialsQuery()
  return (
    <SmallInputForm
      header={t.AddDetail}
      last={
        <SendMutation
          onClick={async () =>
            handleInsertDetail(state).then(res => {
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
        value={Array.from(state.materials.keys())}
        onChange={m => state.setMaterials(m)}
      />
      <DetailMaterialRelationForm />
    </SmallInputForm>
  )
}
