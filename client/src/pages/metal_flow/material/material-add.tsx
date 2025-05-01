import { Box } from '@mui/material'
import { UiUnit } from 'shared'
import { MetalFlowSys } from 'src/lib/routes'
import { Btn, P } from 'src/shortcuts'
import { useInsertMaterialMutation } from 'src/types/graphql-shema'
import { ErrorHint, GenericForm, LoadingHint, SavedHint } from '../shared'
import { TakeLookHint } from '../shared/basic'
import { MySelect } from '../shared/basic-select'
import { goTo } from '../spa'
import { t } from '../text'
import { MaterialShapeSelectTabs } from './shape-select'
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
    <GenericForm
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
    </GenericForm>
  )
}
