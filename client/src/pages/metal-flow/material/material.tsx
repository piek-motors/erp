/** @jsxImportSource @emotion/react */
import { Box, Button, Divider, Sheet, Typography } from '@mui/joy'
import { PageTitle } from 'components'
import { Search } from 'components/search-input'
import { Table } from 'components/table.impl'
import { EnMaterialShape, Material, UiMaterialShape } from 'domain-model'
import { MetalFlowRoutes, openMetalFlowPage } from 'lib/routes'
import { observer } from 'mobx-react-lite'
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
import { map } from '../mappers'
import { SmallInputForm } from '../shared'
import { MaterialUnitSelect } from '../shared/basic'
import { ResourceName } from '../shared/material-name'
import { useStockStore } from '../stock'
import { materialListStore, materialStore } from '../store'
import { t } from '../text'
import {
  ListMaterialInput,
  PipeMaterialInput,
  RoundBarInput,
  SquareMaterialInput
} from './shape-data'
import { MaterialShapeFilter } from './shape-filter'

const tabs: Record<EnMaterialShape, JSX.Element> = {
  [EnMaterialShape.RoundBar]: <RoundBarInput />,
  [EnMaterialShape.SquareBar]: <SquareMaterialInput />,
  [EnMaterialShape.List]: <ListMaterialInput />,
  [EnMaterialShape.Pipe]: <PipeMaterialInput />
}

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
      return <ResourceName resource={m.getLabelProps()} />
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

export const ListMaterials = observer(() => {
  const navigate = useNavigate()
  useEffect(() => {
    materialListStore.fetchAll()
  }, [])
  console.log('ren der')
  return (
    <>
      <PageTitle title={t.MaterialsList} hideIcon>
        <AddResourceButton
          navigateTo={openMetalFlowPage(MetalFlowRoutes.material_add)}
        />
      </PageTitle>

      <Search
        onChange={e => {
          materialListStore.search(e.target.value)
        }}
        value={materialListStore.filterKeyword}
      />
      <MaterialShapeFilter />
      <LoadingHint show={materialListStore.loading} />
      <ErrorHint e={materialListStore.error} />

      <Sheet>
        {materialListStore.materials && (
          <Table
            sx={{
              '& td': {
                padding: 0
              }
            }}
            small
            columns={columnList}
            data={materialListStore.getFilteredMaterials()}
            onRowClick={row => {
              if (!row.id) throw Error('Material id is null')
              navigate(
                openMetalFlowPage(MetalFlowRoutes.material_update, row.id)
              )
            }}
          />
        )}
      </Sheet>
    </>
  )
})

export const AddMaterial = observer(() => {
  const uiTabs: Record<string, JSX.Element> = {}
  for (const [key, val] of Object.entries(tabs)) {
    uiTabs[UiMaterialShape[key]] = val
  }
  useEffect(() => {
    materialStore.clear()
  }, [])
  return (
    <SmallInputForm
      header={t.AddMaterial}
      last={
        <>
          <SendMutation onClick={() => materialStore.insert()} />
          {materialStore.insertedMaterialId && (
            <TakeLookHint
              text={t.RecentlyNewMaterialAdded}
              link={openMetalFlowPage(
                MetalFlowRoutes.material_update,
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
        onChange={v => materialStore.setUnit(v)}
      />
    </SmallInputForm>
  )
})

export const UpdateMaterial = observer(() => {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) {
    return <>No id</>
  }
  useEffect(() => {
    materialStore.load(id)
  }, [])

  return (
    <SmallInputForm
      header={t.EditMaterial}
      name={
        map.material.convertable(materialStore.material) ? (
          <>
            <Box>
              <Typography level="h4">
                <ResourceName
                  resource={materialStore.material?.getLabelProps()}
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
      last={<SendMutation onClick={() => materialStore.update()} />}
    >
      <InputStack>{tabs[materialStore.shape]}</InputStack>
    </SmallInputForm>
  )
})

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
          navigate(
            openMetalFlowPage(MetalFlowRoutes.supply_add, id, {
              material_id: id
            })
          )
        }
      >
        {t.AddSupply}
      </Button>
      <Button
        variant="outlined"
        color="warning"
        onClick={() =>
          navigate(
            openMetalFlowPage(MetalFlowRoutes.writeoff_add, id, {
              material_id: id
            })
          )
        }
      >
        {t.AddWriteoff}
      </Button>
      <Divider />
    </Row>
  )
}
