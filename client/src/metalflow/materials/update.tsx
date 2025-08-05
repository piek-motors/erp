import { Card } from '@mui/joy'
import {
  Inp,
  Loading,
  observer,
  P,
  Stack,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { AlloyAutocomplete, SaveAndDelete } from '../shared/basic'
import { tabList } from './add'
import { DetailsMadeOfMaterialModal } from './details_made_of_that_material'
import { material } from './material.store'
import { MaterialWarehouse } from './warehouse/warehouse'

export const MaterialUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)
  const navigate = useNavigate()

  useEffect(() => {
    material.load(materialId)
    return () => {
      material.clear()
    }
  }, [])

  if (material.async.loading) {
    return <Loading />
  }

  const writeoffError = material.writeoff.validate() !== undefined
  const error = () => {
    if (writeoffError) {
      return (
        <P color="danger" level="body-sm">
          {material.writeoff.validate()?.message}
        </P>
      )
    }
  }

  return (
    <Stack alignItems={'start'} p={1} gap={0.5}>
      <MetalPageTitle t={`Материал #${materialId} ${material.label}`} />
      {/* <Row gap={2} py={1} alignItems={'center'}>
        <RowButColumsAtSm>
          <SupplyModal>
            <MaterialOperation
              materialLabel={material.material?.label}
              lengthValue={material.supply.length}
              lengthSetValue={value => material.supply.setLength(value)}
              reasonComponent={
                <SupplyReasonSelect
                  reason={material.supply.reason}
                  setReason={reason => material.supply.setReason(reason)}
                />
              }
              submitDisabled={material.supply.disabled()}
              onSubmit={() => material.insertSupply()}
            />
          </SupplyModal>
          <WriteoffModal>
            <MaterialOperation
              materialLabel={material.label}
              lengthValue={material.writeoff.length}
              lengthSetValue={value => material.writeoff.setLength(value)}
              reasonComponent={
                <WriteoffReasonSelect
                  reason={material.writeoff.reason}
                  setReason={reason => material.writeoff.setReason(reason)}
                />
              }
              submitDisabled={material.writeoff.disabled()}
              onSubmit={() => material.insertWriteoff()}
              error={error()}
            />
          </WriteoffModal>
          <DetailsMadeOfMaterial />
          <OperationsListModal materialId={materialId} />
        </RowButColumsAtSm>
        <Divider orientation="vertical" />
        <Stack>
          <P>Остаток: {roundAndTrim(material.stock)} м</P>
        </Stack>
      </Row> */}
      <Stack gap={1}>
        <MaterialWarehouse />
        <DetailsMadeOfMaterialModal />
      </Stack>
      <Card variant="outlined" size="sm">
        <Stack>
          {tabList.find(t => t.value === material.shape)?.component}
          <AlloyAutocomplete
            setAlloy={alloy => {
              material.setAlloy(alloy)
            }}
            alloy={material.alloy}
          />
          <Inp
            label={'Линейная масса'}
            value={material.linearMass}
            onChange={v => {
              material.setLinearMass(v)
            }}
            unit="кг/м"
          />
        </Stack>
        <SaveAndDelete
          itemName={`Материал (${material.id}) - ${material.label}`}
          handleDelete={() =>
            material.delete().then(() => {
              navigate(open(routeMap.metalflow.materials))
            })
          }
          handleSave={() => material.update()}
        />
      </Card>
    </Stack>
  )
})
