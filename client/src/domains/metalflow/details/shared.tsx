/** @jsxImportSource @emotion/react */
import { UilMinus } from '@iconscout/react-unicons'
import { Divider, IconButton, Stack } from '@mui/joy'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { JsonEditor } from 'components/json-editor'
import { EnUnit } from 'domain-model'
import { cache } from 'domains/metalflow/cache/root'
import { QtyInputWithUnit } from 'domains/metalflow/shared'
import {
  Box,
  Inp,
  Label,
  MultilineInput,
  MyInputProps,
  PlusIcon,
  Row,
  Sheet,
  UseIcon,
  observer
} from 'lib/index'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { MaterialCost, detailStore } from './detail.store'

export const DetailInputs = () => (
  <Stack gap={0.5}>
    <DetailNameInput />
    <DetailDrawingNameInput />
    <DetailPartCodeInput />
    <DetailGroupInput />
    <DetailParamsInput />
    <MaterialCostInputs />
    <DetailProcessingRouteInput />
    <DetailDescriptionInput />
  </Stack>
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
              <Row key={materialCost.materialId}>
                <Stack gap={0.5}>
                  <MaterialSelect value={materialCost} index={index} />
                  <QtyInputWithUnit
                    size="sm"
                    unitId={EnUnit.MilliMeter}
                    value={materialCost.length}
                    setValue={v => {
                      materialCost.setLength(v)
                    }}
                  />
                </Stack>
                <Stack>
                  <IconButton
                    variant="soft"
                    color="danger"
                    size="sm"
                    onClick={() => {
                      detailStore.deleteDetailMaterial(materialCost.materialId)
                    }}
                  >
                    <UseIcon icon={UilMinus} />
                  </IconButton>
                </Stack>
              </Row>
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
    <Input
      label="Название со склада"
      onChange={v => {
        detailStore.setName(v)
      }}
      value={detailStore.name}
    />
  )
})

export const DetailDrawingNameInput = observer(() => {
  return (
    <Input
      label="Название чертежа"
      onChange={v => {
        detailStore.engineeringSetName(v)
      }}
      value={detailStore.drawingName}
    />
  )
})

export const DetailDescriptionInput = observer(() => {
  return (
    <MultilineInput
      variant="soft"
      label="Примечания в свободной форме"
      onChange={e => {
        detailStore.setDescription(e.target.value)
      }}
      value={detailStore.description}
    />
  )
})

export const DetailProcessingRouteInput = observer(() => {
  return (
    <MultilineInput
      variant="soft"
      label="Маршрут обработки"
      onChange={e => {
        detailStore.setProcessingRoute(e.target.value)
      }}
      value={detailStore.processingRoute}
    />
  )
})

export const DetailPartCodeInput = observer(() => {
  return (
    <Input
      label="Номер чертежа"
      onChange={v => {
        detailStore.setDrawingNumber(v)

        if (v.startsWith('ВЗИС')) {
          alert('Впишите конструкторский номер без приставки "ВЗИС"')
        }
      }}
      value={detailStore.drawingNumber}
    />
  )
})

const Input = (props: MyInputProps) => {
  return <Inp variant="soft" fullWidth {...props} />
}
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
      <Label>Группа детали. Для универсальных деталей оставьте пустым.</Label>
      <BaseAutocomplete
        variant="soft"
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
