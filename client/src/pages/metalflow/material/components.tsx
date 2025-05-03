/** @jsxImportSource @emotion/react */
import { Box, Button, CircularProgress, Divider, Sheet } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UiMaterialShape, UiUnit } from 'shared'
import { EnMaterialShape } from 'shared/enumerations'
import { Search } from 'src/components/search-input'
import { MetalFlowSys } from 'src/lib/routes'
import {
  AddButton,
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
import { emitNotification } from '../../../utils/notification'
import { map } from '../domain-adapter'
import { SmallInputForm } from '../shared'
import { MySelect } from '../shared/basic-select'
import { ResourceName } from '../shared/material-name'
import { Table } from '../shared/table.impl'
import { goTo } from '../spa'
import { useStockStore } from '../stock'
import { t } from '../text'
import { columnList } from './columns.decl'
import {
  CircleMaterialInput,
  ListMaterialInput,
  PipeMaterialInput,
  SquareMaterialInput
} from './shape-data'
import { useMaterialListStore, useMaterialStore } from './state'

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
      <PageTitle title={t.MaterialsList}>
        <AddButton navigateTo={goTo(MetalFlowSys.material_add)} />
      </PageTitle>

      <Sheet>
        <Search
          placeholder={t.Material}
          onChange={e => {
            state.setFilterKeyword(e.target.value)
          }}
          value={state.filterKeyword}
        />
        <LoadingHint show={loading} />
        <ErrorHint e={error} />
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

export function StockAmount(props: { materialId: number }) {
  const stockStore = useStockStore()
  return stockStore.getByIdRounded(props.materialId)
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

      <MySelect
        label={t.Unit}
        onChange={state.setUnit}
        value={state.unit}
        selectElements={Object.entries(UiUnit).map(([key, value]) => {
          return { name: value, value: key }
        })}
      />
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

  const [mut, { data, loading, error }] = gql.useUpdateMaterialMutation()

  const handleSave = async () => {
    await mut({
      variables: {
        id,
        _set: {
          id,
          shape: state.shape,
          shape_data: state.shapeData
        }
      }
    })
  }

  if (ready) {
    return (
      <SmallInputForm
        header={t.EditMaterial}
        name={
          map.material.convertable(state) ? (
            <>
              <Box px={1}>
                <ResourceName
                  resource={state.shapeData?.getResourceNameProps()}
                />
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
    <Row my={3}>
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
      emitNotification('info', 'Материал успешно удален')
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
