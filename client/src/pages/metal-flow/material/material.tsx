/** @jsxImportSource @emotion/react */
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Sheet,
  Typography
} from '@mui/joy'
import { JSX, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { UiMaterialShape } from 'shared'
import { Material } from 'shared/domain'
import { EnMaterialShape } from 'shared/enumerations'
import { Search } from 'src/components/search-input'
import { MetalFlowSys } from 'src/lib/routes'
import {
  AddResourceButton,
  ErrorHint,
  InputStack,
  LoadingHint,
  MyTabs,
  Row,
  SendMutation,
  TakeLookHint
} from 'src/shortcuts'
import * as gql from 'src/types/graphql-shema'
import { PageTitle } from '../../../components'
import { Table } from '../../../components/table.impl'
import { useNotifier } from '../../../store/notifier.store'
import { map } from '../mappers'
import { EditIconButton, SmallInputForm } from '../shared'
import { MaterialUnitSelect } from '../shared/basic'
import { ResourceName } from '../shared/material-name'
import { goTo } from '../spa'
import { useStockStore } from '../stock'
import { t } from '../text'
import {
  CircleMaterialInput,
  ListMaterialInput,
  PipeMaterialInput,
  SquareMaterialInput
} from './shape-data'
import { useMaterialListStore, useMaterialStore } from './state'

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
    accessor: data => {
      return <ResourceName resource={Material.create(data).resourceName()} />
    },
    width: '95%'
  },
  {
    Header: t.Remaining,
    accessor: data => <StockAmount materialId={data.id} />
  },
  {
    Header: t.Unit,
    accessor: data => data.unit()
  },
  {
    Header: 'Действие',
    accessor: data => (
      <EditIconButton
        title={t.EditDetail}
        url={goTo(MetalFlowSys.material_update, data.id)}
      />
    )
  }
]

export function MaterialsList() {
  const { data, loading, error } = gql.useGetMaterialsQuery()
  const navigate = useNavigate()
  const state = useMaterialListStore()

  useEffect(() => {
    if (data) {
      const mtrls = data.metal_pdo_materials.map(map.material.fromDto)
      state.setMaterials(mtrls)
    }
  }, [data])

  return (
    <>
      <PageTitle title={t.MaterialsList} hideIcon>
        <AddResourceButton navigateTo={goTo(MetalFlowSys.material_add)} />
      </PageTitle>

      <Search
        onChange={e => {
          state.setFilterKeyword(e.target.value)
        }}
        value={state.filterKeyword}
      />
      <LoadingHint show={loading} />
      <ErrorHint e={error} />

      <Sheet>
        {state.materials && (
          <Table
            columns={columnList}
            data={state.materials.filter(each => {
              if (!state.filterKeyword) return true

              if (state.searchResult) {
                return state.searchResult.includes(each.id)
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

export function AddMaterial() {
  const [mut, { data, loading, error }] = gql.useInsertMaterialMutation()
  const state = useMaterialStore()

  const handleSave = () => {
    mut({
      variables: {
        object: {
          unit: state.unit,
          shape: state.shape,
          shape_data: state.shapeData
        }
      }
    })
    state.clear()
  }

  const mutResult = data?.insert_metal_pdo_materials_one?.id

  const uiTabs: Record<string, JSX.Element> = {}
  for (const [key, val] of Object.entries(tabs)) {
    uiTabs[UiMaterialShape[key]] = val
  }

  return (
    <SmallInputForm
      header={t.AddMaterial}
      last={
        <>
          <SendMutation onClick={async () => handleSave()} />
          {mutResult && (
            <TakeLookHint
              text={t.RecentlyNewMaterialAdded}
              link={goTo(MetalFlowSys.material_update, mutResult)}
            />
          )}
        </>
      }
    >
      <MyTabs
        tabs={uiTabs}
        handleChange={shape => {
          state.setShape(shape)
        }}
      />

      <MaterialUnitSelect value={state.unit} onChange={state.setUnit} />
    </SmallInputForm>
  )
}

export function UpdateMaterial() {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) {
    return <>No id</>
  }
  const state = useMaterialStore()
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
      state.syncState(map.material.fromDto(d))
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
          shape: state.shape,
          shape_data: state.shapeData
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
          map.material.convertable(state) ? (
            <>
              <Box>
                <Typography level="h4">
                  <ResourceName
                    resource={state.shapeData?.getResourceNameProps()}
                  />
                </Typography>
                {t.Unit} {map.material.fromDto(state).unit()}
              </Box>
              <UpdateMaterialUpdateStockLinks id={id} />
            </>
          ) : (
            <></>
          )
        }
        last={<SendMutation onClick={handleSave} />}
      >
        <InputStack>{tabs[state.shape]}</InputStack>
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
  [EnMaterialShape.Circle]: <CircleMaterialInput />,
  [EnMaterialShape.Square]: <SquareMaterialInput />,
  [EnMaterialShape.List]: <ListMaterialInput />,
  [EnMaterialShape.Pipe]: <PipeMaterialInput />
}
