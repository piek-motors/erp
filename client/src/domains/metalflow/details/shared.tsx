/** @jsxImportSource @emotion/react */
import { UilMinus } from '@iconscout/react-unicons'
import { Divider, IconButton, Stack } from '@mui/joy'
import { ArrayJsonEditor } from 'components/array-json-editor'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { JsonEditor } from 'components/json-editor'
import { cache } from 'domains/metalflow/cache/root'
import { QtyInputWithUnit } from 'domains/metalflow/shared'
import { TextEditor } from 'domains/orders/one/comments/text-editor'
import {
  Box,
  Inp,
  Label,
  MyInputProps,
  PlusIcon,
  Row,
  Sheet,
  UseIcon,
  observer
} from 'lib/index'
import { EnUnit } from 'models'
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
  (props: { value: MaterialCost; index: number }) => (
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
)

export const MaterialCostInputs = observer(() => (
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
))
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
        detailStore.setDrawingName(v)
      }}
      value={detailStore.drawingName}
    />
  )
})

export const DetailDescriptionInput = observer(() => (
  <Box>
    <Label>Примечания в свободной форме</Label>
    <TextEditor
      defaultValue={detailStore.description}
      onChange={content => {
        detailStore.setDescription(content)
      }}
    />
  </Box>
))

export const DetailPartCodeInput = observer(() => (
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
))

const Input = (props: MyInputProps) => (
  <Inp variant="plain" color="neutral" fullWidth {...props} />
)

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
        variant="plain"
        options={groupOptions}
        value={selectedGroup}
        onChange={group => {
          detailStore.setGroupId(group?.value || null)
        }}
      />
    </Stack>
  )
})

export const DetailParamsInput = observer(() => (
  <Box>
    <Label>Технические параметры</Label>
    <JsonEditor
      value={detailStore.technicalParameters}
      onChange={params => detailStore.setTechnicalParameters(params)}
      keyPlaceholder="Параметр"
      valuePlaceholder="Значение"
    />
  </Box>
))

export const DetailProcessingRouteInput = observer(() => (
  <Box>
    <Label>Маршрут обработки</Label>
    <Sheet sx={{ borderRadius: 'sm', p: 1 }}>
      <ArrayJsonEditor
        value={
          detailStore.processingRoute?.steps.map(e => ({
            name: e.name,
            dur: e.dur
          })) ?? null
        }
        placeholder={{
          name: '',
          dur: null
        }}
        onChange={steps =>
          detailStore.setProcessingRoute(steps ? { steps } : null)
        }
        placeholders={['Операция', 'мин']}
        width={[80, 20]}
      />
    </Sheet>
  </Box>
))
