import { Sheet, Stack, Typography } from '@mui/joy'
import { PageTitle } from 'components'
import { Table } from 'components/table.impl'
import { Detail, EnUnit, Material } from 'domain-model'
import { MetalFlowRoutes, openMetalFlowPage } from 'lib/routes'
import { Observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import {
  AddResourceButton,
  MyInput,
  Row,
  SendMutation,
  TakeLookHint
} from 'shortcuts'
import * as gql from 'types/graphql-shema'
import { useGetMaterialsQuery } from 'types/graphql-shema'
import { map } from '../mappers'
import { QtyInputWithUnit, SmallInputForm } from '../shared'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { ResourceName } from '../shared/material-name'
import { detailStore, materialListStore } from '../store'
import { t } from '../text'

const columnList: Column<Detail>[] = [
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
  const id = props.material.id
  const relationData = detailStore.materials.get(id)
  return (
    <>
      <QtyInputWithUnit
        label="Вес заготовки"
        unitId={EnUnit.Gram}
        setValue={v => {
          const relationData = detailStore.materials.get(id)
          if (!relationData) throw Error('Relation data not found')
          detailStore.setMaterialRelationData(id, {
            weight: v,
            length: relationData.length
          })
        }}
        value={relationData ? relationData.weight : ''}
      />
      <QtyInputWithUnit
        label="Длина заготовки"
        unitId={EnUnit.MilliMeter}
        setValue={v => {
          const relationData = detailStore.materials.get(id)
          if (!relationData) throw Error('Relation data not found')
          detailStore.setMaterialRelationData(id, {
            weight: relationData.weight,
            length: v
          })
        }}
        value={relationData ? relationData.length : ''}
      />
    </>
  )
}

function DetailMaterialRelationForm() {
  return (
    <Sheet>
      <Stack my={1} gap={2}>
        {detailStore.materials
          .entries()
          .map(([k, v]) => k)
          .map(id => {
            const material = materialListStore.get(id)
            return (
              <Stack sx={{ width: 'max-content' }} key={id}>
                <Row sx={{ fontWeight: 'bold' }}>
                  <Typography>Материал</Typography>
                  <ResourceName resource={material?.getLabelProps()} />
                </Row>
                <Stack p={1}>
                  <MaterialWeightInput material={material} />
                </Stack>
              </Stack>
            )
          })}
      </Stack>
    </Sheet>
  )
}

export function ListDetails() {
  const navigate = useNavigate()
  const { data } = gql.useGetDetailsQuery()
  const details = data?.metal_flow_details
    ?.map(d => map.detail.fromDto(d))
    .filter(each => {
      return !!each
    })

  return (
    <Observer
      render={() => (
        <>
          <PageTitle title={t.DetailsList} hideIcon>
            <AddResourceButton
              navigateTo={openMetalFlowPage(MetalFlowRoutes.detail_add)}
            />
          </PageTitle>
          <Sheet>
            <Table
              columns={columnList}
              data={details || []}
              onDoubleRowClick={row =>
                navigate(
                  openMetalFlowPage(MetalFlowRoutes.detail_update, row.id)
                )
              }
            />
          </Sheet>
        </>
      )}
    />
  )
}

export function UpdateDetail() {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) return <>No id</>

  useEffect(() => {
    detailStore.load(id)
  }, [])

  return (
    <Observer
      render={() => (
        <SmallInputForm
          header={t.EditDetail}
          last={<SendMutation onClick={detailStore.update} />}
        >
          <Stack gap={1}>
            <Typography>ID {detailStore.id}</Typography>
            <MyInput
              label={t.DetailName}
              onChange={(event: any) => {
                detailStore.setName(event.target.value)
              }}
              value={detailStore.name}
              autoComplete="off"
            />
            <DetailMaterialRelationForm />
          </Stack>
        </SmallInputForm>
      )}
    />
  )
}

export function AddDetail() {
  const { data: materials } = useGetMaterialsQuery()
  return (
    <Observer
      render={() => (
        <SmallInputForm
          header={t.AddDetail}
          last={
            <SendMutation
              onClick={detailStore.insert}
              additionals={(err, res) => (
                <TakeLookHint
                  text={t.RecentlyNewDetailAdded}
                  link={openMetalFlowPage(MetalFlowRoutes.detail_update, res)}
                />
              )}
            />
          }
        >
          <MyInput
            label={t.DetailName}
            onChange={(event: any) => {
              // state.setName(event.target.value)
              detailStore.setName(event.target.value)
            }}
            value={detailStore.name}
            autoComplete="off"
          />
          <MaterialAutocompleteMulti
            data={materials}
            value={Array.from(materialListStore.materials)}
            onChange={m => {
              detailStore.setMaterials(m)
            }}
          />
          <DetailMaterialRelationForm />
        </SmallInputForm>
      )}
    />
  )
}
