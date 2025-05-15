/** @jsxImportSource @emotion/react */
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Sheet,
  Typography
} from '@mui/joy'
import { Search } from 'components/search-input'
import { MetalFlowSys } from 'lib/routes'
import { JSX, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { EnMaterialShape, Material, UiMaterialShape } from 'domain-model'
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
import * as gql from 'types/graphql-shema'
import { PageTitle } from '../../../components'
import { Table } from '../../../components/table.impl'
import { useNotifier } from '../../../store/notifier.store'
import { map } from '../mappers'
import { SmallInputForm } from '../shared'
import { MaterialUnitSelect } from '../shared/basic'
import { ResourceName } from '../shared/material-name'
import { goTo } from '../spa'
import { useStockStore } from '../stock'
import { t } from '../text'
import { MaterialListStore } from './material-list.store'
import { MaterialStore } from './material.store'
import {
  ListMaterialInput,
  PipeMaterialInput,
  RoundBarInput,
  SquareMaterialInput
} from './shape-data'

function StockAmount(props: { materialId: number }) {
  const stockStore = useStockStore()
  return stockStore.getByIdRounded(props.materialId)
}

const columnList: Column<Material>[] = [
  {
    Header: 'Id',
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

export function MaterialsList(props: { store: MaterialListStore }) {
  const { store } = props
  const { data, loading, error } = gql.useGetMaterialsQuery()
  const navigate = useNavigate()

  useEffect(() => {
    if (data) {
      const mtrls = data.metal_pdo_materials.map(map.material.fromDto)
      store.setMaterials(mtrls)
    }
  }, [data])

  return (
    <>
      <PageTitle title={t.MaterialsList} hideIcon>
        <AddResourceButton navigateTo={goTo(MetalFlowSys.material_add)} />
      </PageTitle>

      <Search
        onChange={e => {
          store.search(e.target.value)
        }}
        value={store.filterKeyword}
      />
      <LoadingHint show={loading} />
      <ErrorHint e={error} />

      <Sheet>
        {store.materials && (
          <Table
            columns={columnList}
            data={store.materials.filter(each => {
              if (!store.filterKeyword) return true

              if (store.searchResult) {
                return store.searchResult.includes(each.id)
              }

              return true
            })}
            onDoubleRowClick={row => {
              navigate(goTo(MetalFlowSys.material_update, row.id))
            }}
          />
        )}
      </Sheet>
    </>
  )
}

export function AddMaterial(props: { store: MaterialStore }) {
  const { store } = props
  const uiTabs: Record<string, JSX.Element> = {}
  for (const [key, val] of Object.entries(tabs)) {
    uiTabs[UiMaterialShape[key]] = val
  }

  return (
    <SmallInputForm
      header={t.AddMaterial}
      last={
        <>
          <SendMutation onClick={store.insert} />
          {store.insertedMaterialId && (
            <TakeLookHint
              text={t.RecentlyNewMaterialAdded}
              link={goTo(
                MetalFlowSys.material_update,
                store.insertedMaterialId
              )}
            />
          )}
        </>
      }
    >
      <MyTabs tabs={uiTabs} handleChange={store.setShape} />

      <MaterialUnitSelect value={store.unit} onChange={store.setUnit} />
    </SmallInputForm>
  )
}

export function UpdateMaterial(props: { store: MaterialStore }) {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) {
    return <>No id</>
  }
  const { store } = props
  const [ready, setReady] = useState<boolean>(false)
  const { data: existing } = gql.useGetMaterialByPkQuery({
    variables: {
      id
    }
  })

  useEffect(() => {
    if (existing) {
      const d = existing.metal_pdo_materials_by_pk
      if (!d) throw Error('Material not found')
      store.syncState(map.material.fromDto(d))
      setReady(true)
    }
  }, [existing])

  const [mut] = gql.useUpdateMaterialMutation()
  const notifier = useNotifier()
  const handleSave = async () => {
    const res = await mut({
      variables: {
        id,
        _set: {
          id,
          shape: store.shape,
          shape_data: store.shapeData
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

  if (ready) {
    return (
      <SmallInputForm
        header={t.EditMaterial}
        name={
          map.material.convertable(existing?.metal_pdo_materials_by_pk) ? (
            <>
              <Box>
                <Typography level="h4">
                  <ResourceName resource={store.getResourceNameProps()} />
                </Typography>
                {t.Unit} {store.unit}
              </Box>
              <UpdateMaterialUpdateStockLinks id={id} />
            </>
          ) : (
            <></>
          )
        }
        last={<SendMutation onClick={handleSave} />}
      >
        <InputStack>{tabs[store.shape]}</InputStack>
      </SmallInputForm>
    )
  } else return <CircularProgress />
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

export function DeleteMaterial(props: { id: number }) {
  const notifier = useNotifier()
  const [mut, { loading }] = gql.useDeleteMaterialMutation({
    variables: {
      id: props.id
    }
  })

  const navigate = useNavigate()
  const handle = async () => {
    const res = await mut()
    if (res.data?.delete_metal_pdo_materials_by_pk?.id) {
      navigate(goTo(MetalFlowSys.materials))
      notifier.notify('info', 'Материал успешно удален')
    } else {
      alert(res.errors)
    }
  }

  return (
    <Button
      variant="outlined"
      color="danger"
      sx={{ width: 'max-content' }}
      onClick={handle}
      disabled={loading}
    >
      {t.Delete}
    </Button>
  )
}

const tabs: Record<EnMaterialShape, JSX.Element> = {
  [EnMaterialShape.RoundBar]: <RoundBarInput />,
  [EnMaterialShape.SquareBar]: <SquareMaterialInput />,
  [EnMaterialShape.List]: <ListMaterialInput />,
  [EnMaterialShape.Pipe]: <PipeMaterialInput />
}
