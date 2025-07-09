/** @jsxImportSource @emotion/react */
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { EnUnit } from 'domain-model'
import {
  Box,
  DeleteResourceButton,
  Inp,
  Label,
  PlusIcon,
  Row,
  Sheet,
  Stack,
  observer
} from 'lib/index'
import { cache } from 'metalflow/cache/root'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { QtyInputWithUnit } from '../shared/qty_input_with_unit'
import { MaterialCost, detailStore } from './detail.store'

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
        data={cache.materials.getMaterials().map(e => {
          return new MaterialCost({
            materialId: e.id,
            label: e.label
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
    <Box>
      <Label>Расход материалов</Label>
      <Sheet sx={{ borderRadius: 'sm', p: 1 }}>
        <Stack gap={1}>
          {detailStore.usedMaterials.map((materialCost, index) => {
            return (
              <Stack
                sx={{ width: 'max-content' }}
                key={materialCost.materialId}
              >
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
        <PlusIcon
          sx={{ mt: 1 }}
          onClick={() => {
            detailStore.addMaterial(
              detailStore.usedMaterials.length,
              { id: 0, label: '' },
              { length: '', weight: '' }
            )
          }}
        />
      </Sheet>
    </Box>
  )
})
export const DetailNameInput = observer(() => {
  return (
    <Inp
      fullWidth
      label="Наименование детали (без группы)"
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

        if (v.startsWith('ВЗИС')) {
          alert('Впишите конструкторский номер без приставки "ВЗИС"')
        }
      }}
      value={detailStore.partCode}
    />
  )
})

export const DetailGroupInput = observer(() => {
  const groupOptions: BaseOption[] = cache.detailGroups
    .getGroups()
    .map(group => ({
      label: group.name,
      value: group.id
    }))

  const selectedGroup =
    groupOptions.find(option => option.value === detailStore.groupId) || null

  return (
    <Stack>
      <Label>
        Группа детали (если деталь универсальная и используется в разных
        группах, оставьте пустым)
      </Label>
      <BaseAutocomplete
        options={groupOptions}
        value={selectedGroup}
        onChange={group => {
          detailStore.setGroupId(group?.value || null)
        }}
      />
    </Stack>
  )
})

import { JsonEditor } from 'components/json-editor'

export const DetailParamsInput = observer(() => {
  return (
    <Box>
      <Label>Технические параметры</Label>
      <JsonEditor
        value={detailStore.params}
        onChange={params => detailStore.setParams(params)}
        keyPlaceholder="Параметр"
        valuePlaceholder="Значение"
      />
    </Box>
  )
})
