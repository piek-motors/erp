import { EnUnit } from 'domain-model'
import { P, Row, Sheet, Stack, observer, useEffect } from 'lib/shortcuts'
import { QtyInputWithUnit } from '../shared'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { detailStore } from '../store'
import { MaterialRelation } from './store/detail.store'

export const MaterialWeightInput = observer(
  (props: { materialRelation: MaterialRelation }) => {
    return (
      <>
        <QtyInputWithUnit
          label="Вес"
          unitId={EnUnit.Gram}
          setValue={v => {
            props.materialRelation.setWeight(v)
          }}
          value={props.materialRelation.weight}
        />
        <QtyInputWithUnit
          label="Длина"
          unitId={EnUnit.MilliMeter}
          setValue={v => {
            props.materialRelation.setLength(v)
          }}
          value={props.materialRelation.length}
        />
      </>
    )
  }
)

export const DetailMaterialSelectForm = observer(() => {
  useEffect(() => {
    detailStore.loadMaterials()
  }, [])

  return (
    <>
      <MaterialAutocompleteMulti
        data={detailStore.materialsSuggestions}
        value={detailStore.usedMaterials.map(m => m.material)}
        onChange={m => {
          detailStore.setMaterialRelations(
            m.map(
              m =>
                new MaterialRelation(m, {
                  length: '',
                  weight: ''
                })
            )
          )
        }}
      />
      <Sheet sx={{ borderRadius: 'sm' }}>
        <Stack my={1} gap={1}>
          {detailStore.usedMaterials.map(materialRelation => {
            const { material } = materialRelation
            return (
              <Stack sx={{ width: 'max-content' }} key={material.id}>
                <Row sx={{ fontWeight: 'bold', px: 1 }}>
                  <P>Расход для материала</P>
                  <P>{material?.label}</P>
                </Row>
                <Stack p={1}>
                  <MaterialWeightInput materialRelation={materialRelation} />
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      </Sheet>
    </>
  )
})
