/** @jsxImportSource @emotion/react */
import { Box, Button, CircularProgress, Divider, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UiUnit } from 'shared'
import { EnMaterialShape } from 'shared/enumerations'
import { Search } from 'src/components/search-input'
import { MetalFlowSys } from 'src/lib/routes'
import { Btn, P } from 'src/shortcuts'
import * as gql from 'src/types/graphql-shema'
import { PaperL1 } from '../../../components/paper'
import { notif } from '../../../utils/notification'
import { map } from '../domain-adapter'
import {
  ErrorHint,
  ListPageHeader,
  LoadingHint,
  SavedHint,
  SmallInputForm
} from '../shared'
import { TakeLookHint } from '../shared/basic'
import { MySelect } from '../shared/basic-select'
import { ResourceName } from '../shared/material-name'
import { ShapeDependedTabs } from '../shared/shape-depended-tabs'
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
import { useMaterialStore } from './state'

export function MaterialsList() {
  const { data, loading, error } = gql.useGetMaterialsQuery({})
  const navigate = useNavigate()

  const materials = data?.metal_pdo_materials?.map(map.material.fromDto)
  return (
    <Stack>
      <ListPageHeader
        title={t.MaterialsList}
        btnText={t.AddMaterial}
        goto={MetalFlowSys.material_add}
      />
      <PaperL1 sx={{ gap: 2 }}>
        <Search placeholder={t.Material} onChange={() => {}} value="" />
        <LoadingHint show={loading} />
        <ErrorHint show={error} msg={error?.message} />
        {materials && (
          <Table
            columns={columnList}
            data={materials}
            onDoubleRowClick={row => {
              navigate(goTo(MetalFlowSys.material_update, row.id))
            }}
          />
        )}
      </PaperL1>
    </Stack>
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
  }

  const mutResult = data?.insert_metal_pdo_materials_one?.id
  const actionSection = (
    <>
      <ErrorHint show={error} msg={error?.message} />
      <SavedHint show={mutResult} />
      <LoadingHint show={loading} />
      <Btn variant="contained" onClick={handleSave} disabled={loading}>
        {t.Save}
      </Btn>
      {mutResult && (
        <TakeLookHint
          text={t.RecentlyNewMaterialAdded}
          link={goTo(MetalFlowSys.material_update, mutResult)}
        />
      )}
    </>
  )

  return (
    <SmallInputForm
      header={t.AddMaterial}
      goBackUrl={MetalFlowSys.materials}
      lastSection={actionSection}
    >
      <Box>
        <P variant="caption">{t.MaterialFormHint}</P>
        <MaterialShapeSelectTabs />
      </Box>
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

  const saveActionsBlock = (
    <>
      <ErrorHint show={error} msg={error?.message} />
      <SavedHint show={data?.update_metal_pdo_materials_by_pk} />
      <LoadingHint show={loading} />
      <Stack direction={'row'} gap={1}>
        <Btn
          variant="contained"
          sx={{ flexGrow: 3 }}
          onClick={handleSave}
          disabled={loading}
        >
          {t.Save}
        </Btn>
      </Stack>
    </>
  )

  if (ready) {
    return (
      <SmallInputForm
        header={t.EditMaterial}
        goBackUrl={MetalFlowSys.materials}
        nameComponent={
          map.material.convertable(state) ? (
            <Box px={1}>
              <ResourceName
                resource={state.shapeData?.getResourceNameProps()}
              />
              <P>
                {t.Unit} {map.material.fromDto(state).unit()}
              </P>
            </Box>
          ) : (
            <></>
          )
        }
        beforeFormComp={<UpdateMaterialUpdateStockLinks id={id} />}
        lastSection={saveActionsBlock}
      >
        <Box>{getInputFormByShapeValue(state.shape)}</Box>
      </SmallInputForm>
    )
  } else return <CircularProgress />
}

function UpdateMaterialUpdateStockLinks(props: { id: number }) {
  const navigate = useNavigate()
  const { id } = props

  return (
    <Stack direction={'column'} alignItems={'start'} py={2} gap={1}>
      <Divider />
      <Btn
        onClick={() =>
          navigate(goTo(MetalFlowSys.supply_add, id, { material_id: id }))
        }
      >
        {t.AddSupply}
      </Btn>
      <Btn
        onClick={() =>
          navigate(goTo(MetalFlowSys.writeoff_add, id, { material_id: id }))
        }
      >
        {t.AddWriteoff}
      </Btn>
      <Divider />
    </Stack>
  )
}

export function DeleteMaterial(props: { id: number }) {
  const [mut, { loading, data, error }] = gql.useDeleteMaterialMutation({
    variables: {
      id: props.id
    }
  })

  const navigate = useNavigate()
  const handle = async () => {
    const res = await mut()
    if (res.data?.delete_metal_pdo_materials_by_pk?.id) {
      navigate(goTo(MetalFlowSys.materials))
      notif('info', 'Материал успешно удален')
    } else {
      alert(res.errors)
    }
  }

  return (
    <Button
      variant="outlined"
      color="error"
      sx={{ width: 'max-content' }}
      onClick={handle}
      disabled={loading}
    >
      {t.Delete}
    </Button>
  )
}

const tabs = {
  Круг: <CircleMaterialInput />,
  Квадрат: <SquareMaterialInput />,
  Лист: <ListMaterialInput />,
  Труба: <PipeMaterialInput />
}

export function MaterialShapeSelectTabs() {
  const state = useMaterialStore()
  return (
    <ShapeDependedTabs
      data={tabs}
      handleChange={shape => {
        state.setShape(shape)
      }}
    />
  )
}

export function getInputFormByShapeValue(shape: EnMaterialShape) {
  switch (shape) {
    case EnMaterialShape.Circle:
      return <CircleMaterialInput />
    case EnMaterialShape.Square:
      return <SquareMaterialInput />
    case EnMaterialShape.List:
      return <ListMaterialInput />
    case EnMaterialShape.Pipe:
      return <PipeMaterialInput />
    default:
      throw new Error('Unknown shape')
  }
}
