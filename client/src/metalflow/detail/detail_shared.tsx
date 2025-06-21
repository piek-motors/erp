import { EnUnit } from 'domain-model'
import {
  Button,
  DeleteResourceButton,
  Inp,
  Label,
  Row,
  Sheet,
  Stack,
  observer
} from 'lib/index'
import { QtyInputWithUnit } from '../metalflow_shared'
import { MaterialAutocomplete } from '../shared/material-autocomplete'
import { detailStore } from '../store'
import { MaterialCost } from './store/detail.store'

export const MaterialWeightInput = observer(
  (props: { materialRelation: MaterialCost }) => {
    return (
      <Row gap={3}>
        <QtyInputWithUnit
          size="sm"
          label="Вес"
          unitId={EnUnit.Gram}
          setValue={v => {
            props.materialRelation.setWeight(v)
          }}
          value={props.materialRelation.weight}
        />
        <QtyInputWithUnit
          size="sm"
          label="Длина"
          unitId={EnUnit.MilliMeter}
          setValue={v => {
            props.materialRelation.setLength(v)
          }}
          value={props.materialRelation.length}
        />
      </Row>
    )
  }
)

export const MaterialSelect = observer(
  (props: { value: MaterialCost; index: number }) => {
    return (
      <MaterialAutocomplete
        size="sm"
        data={detailStore.materialsSuggestions.map(e => {
          return new MaterialCost({
            materialId: e.materialId,
            label: e.materialLabel
          })
        })}
        value={props.value}
        onChange={m => {
          if (m) {
            detailStore.updateMaterialRelation(
              props.index,
              { id: m.materialId, label: m.materialLabel },
              {
                length: m.length,
                weight: m.weight
              }
            )
          }
        }}
      />
    )
  }
)

export const MaterialRelationDataInputs = observer(() => {
  return (
    <Sheet sx={{ borderRadius: 'sm' }}>
      <Stack gap={1}>
        {detailStore.usedMaterials.map((materialCost, index) => {
          return (
            <Stack
              sx={{ width: 'max-content', p: 1 }}
              key={materialCost.materialId}
            >
              <Label>Расход для материала</Label>
              <Stack>
                <Row>
                  <MaterialSelect value={materialCost} index={index} />
                  <DeleteResourceButton
                    onClick={() => {
                      if (!detailStore.id) {
                        throw new Error('Detail id is not set')
                      }

                      detailStore.deleteDetailMaterial(
                        detailStore.id,
                        materialCost.materialId
                      )
                    }}
                  />
                </Row>
                <MaterialWeightInput materialRelation={materialCost} />
              </Stack>
            </Stack>
          )
        })}
      </Stack>
      <Button
        sx={{ m: 1 }}
        variant="soft"
        onClick={() => {
          detailStore.addMaterial(
            detailStore.usedMaterials.length,
            {
              id: 0,
              label: ''
            },
            { length: '', weight: '' }
          )
        }}
      >
        Добавить материал
      </Button>
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
