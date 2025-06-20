import { EnUnit } from 'domain-model'
import { Inp, P, Row, Sheet, Stack, observer } from 'lib/index'
import { QtyInputWithUnit } from '../shared'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { detailStore } from '../store'
import { MaterialCost } from './store/detail.store'

export const MaterialWeightInput = observer(
  (props: { materialRelation: MaterialCost }) => {
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

export const MaterialialsSelect = observer(() => {
  return (
    <MaterialAutocompleteMulti
      data={detailStore.materialsSuggestions.map(e => {
        return new MaterialCost({
          materialId: e.materialId,
          label: e.materialLabel
        })
      })}
      value={detailStore.usedMaterials.map(m => {
        return new MaterialCost({
          materialId: m.materialId,
          label: m.materialLabel
        })
      })}
      onChange={m => {
        if (m.length) {
          detailStore.setMaterialRelations(m.map(m => m))
        }
      }}
    />
  )
})

export const MaterialRelationDataInputs = observer(() => {
  return (
    <Sheet sx={{ borderRadius: 'sm' }}>
      <Stack my={1} gap={1}>
        {detailStore.usedMaterials.map(materialRelation => {
          return (
            <Stack
              sx={{ width: 'max-content' }}
              key={materialRelation.materialId}
            >
              <Row sx={{ fontWeight: 'bold', px: 1 }}>
                <P>Расход для материала</P>
                <P>{materialRelation?.materialLabel}</P>
              </Row>
              <Stack p={1}>
                <MaterialWeightInput materialRelation={materialRelation} />
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Sheet>
  )
})

export const DetailNameInput = observer(() => {
  return (
    <Inp
      fullWidth
      label="Наименование детали"
      onChange={v => {
        detailStore.setName(v)
      }}
      value={detailStore.name}
    />
  )
})

export const DetailPartCodeInput = observer(() => {
  return (
    <Inp
      label="Конструкторский номер"
      onChange={v => {
        detailStore.setPartCode(v)
      }}
      value={detailStore.partCode}
    />
  )
})
