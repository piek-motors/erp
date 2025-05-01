import { Box, CircularProgress, Divider, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MetalFlowSys } from 'src/lib/routes'
import { Btn, P } from 'src/shortcuts'
import {
  useGetMaterialByPkQuery,
  useUpdateMaterialMutation
} from 'src/types/graphql-shema'
import { Material } from '../domain/material'
import { ErrorHint, GenericForm, LoadingHint, SavedHint } from '../shared'
import { MaterialName } from '../shared/material-name'
import { goTo } from '../spa'
import { t } from '../text'
import { getInputFormByShapeValue } from './shape-select'
import { useMaterialStore } from './state'

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
      <GenericForm
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
      </GenericForm>
    )
  } else return <CircularProgress />
}
