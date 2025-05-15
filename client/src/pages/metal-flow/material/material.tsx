/** @jsxImportSource @emotion/react */
import { Box, Button, Divider, Sheet, Typography } from '@mui/joy'
import { PageTitle } from 'components'
import { Search } from 'components/search-input'
import { Table } from 'components/table.impl'
import { EnMaterialShape, Material, UiMaterialShape } from 'domain-model'
import { MetalFlowSys } from 'lib/routes'
import { Observer } from 'mobx-react-lite'
import { JSX, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import {
  AddResourceButton,
  ErrorHint,
  InputStack,
  LoadingHint,
  MyTabs,
  Row,
  SendMutation,
  TakeLookHint
} from 'shortcuts'
import { useNotifier } from 'store/notifier.store'
import * as gql from 'types/graphql-shema'
import { map } from '../mappers'
import { SmallInputForm } from '../shared'
import { MaterialUnitSelect } from '../shared/basic'
import { ResourceName } from '../shared/material-name'
import { goTo } from '../spa'
import { useStockStore } from '../stock'
import { materialListStore, materialStore } from '../stores'
import { t } from '../text'
import {
  ListMaterialInput,
  PipeMaterialInput,
  RoundBarInput,
  SquareMaterialInput
} from './shape-data'

function StockAmount(props: { materialId: number | null }) {
  const stockStore = useStockStore()
  if (!props.materialId) return '-'
  return stockStore.getByIdRounded(props.materialId)
}

const columnList: Column<Material>[] = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: t.Material,
    id: 'name',
    accessor: m => {
      return <ResourceName resource={m.getResourceNameProps()} />
    },
    width: '95%'
  },
  {
    Header: t.Remaining,
    accessor: m => <StockAmount materialId={m.id} />
  },
  {
    Header: t.Unit,
    accessor: m => m.unitUI
  }
]

export function ListMaterials() {
  const navigate = useNavigate()
  useEffect(() => {
    materialListStore.fetchAll()
  }, [])
  return (
    <Observer
      render={() => (
        <>
          <PageTitle title={t.MaterialsList} hideIcon>
            <AddResourceButton navigateTo={goTo(MetalFlowSys.material_add)} />
          </PageTitle>

          <Search
            onChange={e => {
              materialListStore.search(e.target.value)
            }}
            value={materialListStore.filterKeyword}
          />
          <LoadingHint show={materialListStore.loading} />
          <ErrorHint e={materialListStore.error} />

          <Sheet>
            {materialListStore.materials && (
              <Table
                columns={columnList}
                data={materialListStore.materials.filter(each => {
                  if (!each.id) return false
                  if (!materialListStore.filterKeyword) return true

                  if (materialListStore.searchResult) {
                    return materialListStore.searchResult.includes(each.id)
                  }

                  return true
                })}
                onDoubleRowClick={row => {
                  if (!row.id) throw Error('Material id is null')
                  navigate(goTo(MetalFlowSys.material_update, row.id))
                }}
              />
            )}
          </Sheet>
        </>
      )}
    />
  )
}

export function AddMaterial() {
  const uiTabs: Record<string, JSX.Element> = {}
  for (const [key, val] of Object.entries(tabs)) {
    uiTabs[UiMaterialShape[key]] = val
  }

  return (
    <SmallInputForm
      header={t.AddMaterial}
      last={
        <>
          <SendMutation onClick={materialStore.insert} />
          {materialStore.insertedMaterialId && (
            <TakeLookHint
              text={t.RecentlyNewMaterialAdded}
              link={goTo(
                MetalFlowSys.material_update,
                materialStore.insertedMaterialId
              )}
            />
          )}
        </>
      }
    >
      <MyTabs tabs={uiTabs} handleChange={materialStore.setShape} />

      <MaterialUnitSelect
        value={materialStore.unit}
        onChange={materialStore.setUnit}
      />
    </SmallInputForm>
  )
}

export function UpdateMaterial() {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) {
    return <>No id</>
  }
  useEffect(() => {
    materialStore.load(id)
  }, [])

  const [mut] = gql.useUpdateMaterialMutation()
  const notifier = useNotifier()
  const handleSave = async () => {
    const res = await mut({
      variables: {
        id,
        _set: {
          id,
          shape: materialStore.shape,
          shape_data: materialStore.shapeData
        }
      }
    })
    if (res.errors?.length) {
      notifier.notify(
        'err',
        `Не сработало: ${JSON.stringify(res.errors, null, 2)}`
      )
    } else {
      notifier.notify('info', 'Материал успешно обновлен')
    }
  }

  return (
    <Observer
      render={() => (
        <SmallInputForm
          header={t.EditMaterial}
          name={
            map.material.convertable(materialStore.material) ? (
              <>
                <Box>
                  <Typography level="h4">
                    <ResourceName
                      resource={materialStore.material?.getResourceNameProps()}
                    />
                  </Typography>
                  {t.Unit} {materialStore.unit}
                </Box>
                <UpdateMaterialUpdateStockLinks id={id} />
              </>
            ) : (
              <></>
            )
          }
          last={<SendMutation onClick={handleSave} />}
        >
          <InputStack>{tabs[materialStore.shape]}</InputStack>
        </SmallInputForm>
      )}
    />
  )
}

function UpdateMaterialUpdateStockLinks(props: { id: number }) {
  const navigate = useNavigate()
  const { id } = props

  return (
    <Row mt={2}>
      <Divider />
      <Button
        variant="outlined"
        color="warning"
        onClick={() =>
          navigate(goTo(MetalFlowSys.supply_add, id, { material_id: id }))
        }
      >
        {t.AddSupply}
      </Button>
      <Button
        variant="outlined"
        color="warning"
        onClick={() =>
          navigate(goTo(MetalFlowSys.writeoff_add, id, { material_id: id }))
        }
      >
        {t.AddWriteoff}
      </Button>
      <Divider />
    </Row>
  )
}

const tabs: Record<EnMaterialShape, JSX.Element> = {
  [EnMaterialShape.RoundBar]: <RoundBarInput />,
  [EnMaterialShape.SquareBar]: <SquareMaterialInput />,
  [EnMaterialShape.List]: <ListMaterialInput />,
  [EnMaterialShape.Pipe]: <PipeMaterialInput />
}
