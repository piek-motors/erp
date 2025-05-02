/** @jsxImportSource @emotion/react */
import { Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Search } from 'src/components/search-input'
import { MetalFlowSys } from 'src/lib/routes'
import { useGetMaterialsQuery } from 'src/types/graphql-shema'
import { PaperL1 } from '../../../components/paper'
import { ListPageHeader } from '../shared'
import { Table } from '../shared/table.impl'
import { goTo } from '../spa'
import { useStockStore } from '../stock'
import { t } from '../text'
import { columnList } from './columns.decl'

export function MaterialsList() {
  const { data } = useGetMaterialsQuery({})
  return (
    <Stack>
      <ListPageHeader
        title={t.MaterialsList}
        btnText={t.AddMaterial}
        goto={MetalFlowSys.material_add}
      />
      <PaperL1 sx={{ gap: 2 }}>
        <Search placeholder={t.Material} onChange={() => {}} value="" />
        <TableWithStock data={data} />
      </PaperL1>
    </Stack>
  )
}

function TableWithStock(props: {
  data?: ReturnType<typeof useGetMaterialsQuery>['data']
}) {
  const { data } = props
  const navigate = useNavigate()

  return (
    <Table
      columns={columnList}
      data={data?.metal_pdo_materials || []}
      onDoubleRowClick={row => {
        navigate(goTo(MetalFlowSys.material_update, row.id))
      }}
    />
  )
}

export function StockAmount(props: { materialId: number }) {
  const stockStore = useStockStore()
  return stockStore.getByIdRounded(props.materialId)
}

import { Box } from '@mui/material'
import { UiUnit } from 'shared'
import { Btn, P } from 'src/shortcuts'
import { useInsertMaterialMutation } from 'src/types/graphql-shema'
import { ErrorHint, LoadingHint, SavedHint, SmallInputForm } from '../shared'
import { TakeLookHint } from '../shared/basic'
import { MySelect } from '../shared/basic-select'
import { useMaterialStore } from './state'

export function AddMaterial() {
  const [mut, { data, loading, error }] = useInsertMaterialMutation()
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

import { CircularProgress, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Material } from 'shared/domain'
import {
  useGetMaterialByPkQuery,
  useUpdateMaterialMutation
} from 'src/types/graphql-shema'
import { MaterialName } from '../shared/material-name'

export function UpdateMaterial() {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) {
    return <>No id</>
  }
  const state = useMaterialStore()
  const [ready, setReady] = useState<boolean>(false)
  const navigate = useNavigate()
  const { data: material } = useGetMaterialByPkQuery({
    variables: {
      id
    }
  })

  useEffect(() => {
    if (material) {
      const d = material.metal_pdo_materials_by_pk
      if (!d) throw Error('Material not found')
      state.unpack(d)
      setReady(true)
    }
  }, [material])

  const [mut, { data, loading, error }] = useUpdateMaterialMutation()

  const handleSave = async () => {
    await mut({
      variables: {
        id,
        _set: state.pack()
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

  const materialView = new Material(
    state.id,
    state.unit,
    state.shape,
    state.shapeData as any
  )

  if (ready) {
    return (
      <SmallInputForm
        header={t.EditMaterial}
        goBackUrl={MetalFlowSys.materials}
        nameComponent={
          <Box px={1}>
            <MaterialName
              shape={materialView.shapeId}
              shapeData={materialView.shapeData}
            />
            <P>
              {t.Unit} {materialView.unit()}
            </P>
          </Box>
        }
        beforeFormComp={
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
                navigate(
                  goTo(MetalFlowSys.writeoff_add, id, { material_id: id })
                )
              }
            >
              {t.AddWriteoff}
            </Btn>

            <Divider />
          </Stack>
        }
        lastSection={saveActionsBlock}
      >
        <Box>{getInputFormByShapeValue(state.shape)}</Box>
      </SmallInputForm>
    )
  } else return <CircularProgress />
}

import { Button } from '@mui/material'
import { useDeleteMaterialMutation } from 'src/types/graphql-shema'
import { notif } from '../../../utils/notification'

export function DeleteMaterial(props: { id: number }) {
  const [mut, { loading, data, error }] = useDeleteMaterialMutation({
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

import { EnMaterialShape } from 'shared/enumerations'
import { ShapeDependedTabs } from '../shared/shape-depended-tabs'
import { CircleShapeForm } from './shape/circle'
import { ListShapeForm } from './shape/list'
import { PipeShapeForm } from './shape/pipe'
import { SquareShapeForm } from './shape/square'

const tabs = {
  Круг: <CircleShapeForm />,
  Квадрат: <SquareShapeForm />,
  Лист: <ListShapeForm />,
  Труба: <PipeShapeForm />
}

export function MaterialShapeSelectTabs() {
  const state = useMaterialStore()

  return (
    <ShapeDependedTabs
      data={tabs}
      handleChange={shape => {
        state.setShape(shape as any)
      }}
    />
  )
}

export function getInputFormByShapeValue(shape: EnMaterialShape) {
  switch (shape) {
    case EnMaterialShape.Circle:
      return <CircleShapeForm />
    case EnMaterialShape.Square:
      return <SquareShapeForm />
    case EnMaterialShape.List:
      return <ListShapeForm />
    case EnMaterialShape.Pipe:
      return <PipeShapeForm />
    default:
      throw new Error('Unknown shape')
  }
}
