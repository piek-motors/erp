/** @jsxImportSource @emotion/react */
import { UilTimes } from '@iconscout/react-unicons'
import { Divider, IconButton } from '@mui/joy'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { JsonEditor } from 'components/json-editor'
import { EnUnit } from 'domain-model'
import {
  Box,
  Inp,
  Label,
  MultilineInput,
  PlusIcon,
  Row,
  Sheet,
  Stack,
  UseIcon,
  observer
} from 'lib/index'
import { cache } from 'metalflow/cache/root'
import { QtyInputWithUnit } from 'metalflow/shared'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { MaterialCost, detailStore } from './detail.store'

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
                length: m.length
              }
            )
          }
        }}
      />
    )
  }
)
export const MaterialCostInputs = observer(() => {
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
                <Row alignItems={'end'} gap={1}>
                  <MaterialSelect value={materialCost} index={index} />
                  <QtyInputWithUnit
                    size="sm"
                    unitId={EnUnit.MilliMeter}
                    value={materialCost.length}
                    setValue={v => {
                      materialCost.setLength(v)
                    }}
                  />
                  <IconButton
                    variant="plain"
                    color="danger"
                    size="sm"
                    onClick={() => {
                      detailStore.deleteDetailMaterial(materialCost.materialId)
                    }}
                  >
                    <UseIcon icon={UilTimes} />
                  </IconButton>
                </Row>
              </Stack>
            )
          })}
        </Stack>
        <Divider sx={{ my: 1 }} />
        <PlusIcon
          onClick={() => {
            detailStore.addMaterial({ id: 0, label: '' }, { length: '' })
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

export const DetailDescriptionInput = observer(() => {
  return (
    <MultilineInput
      label="Примечания в свободной форме"
      onChange={e => {
        detailStore.setDescription(e.target.value)
      }}
      value={detailStore.description}
    />
  )
})

export const DetailPartCodeInput = observer(() => {
  return (
    <Inp
      label="Артикул (конструкторский номер без приставки 'ВЗИС')"
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

export const DetailParamsInput = observer(() => {
  return (
    <Box>
      <Label>Технические параметры</Label>
      <JsonEditor
        value={detailStore.technicalParameters}
        onChange={params => detailStore.setTechnicalParameters(params)}
        keyPlaceholder="Параметр"
        valuePlaceholder="Значение"
      />
    </Box>
  )
})
