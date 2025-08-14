/** @jsxImportSource @emotion/react */
import { AccordionGroup, Stack } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ArrayJsonEditor } from 'components/array-json-editor'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { cache } from 'domains/metalflow/cache/root'
import { TextEditor } from 'domains/orders/one/comments/text-editor'
import { Box, Inp, Label, MyInputProps, observer } from 'lib/index'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { AutomaticWriteoffAccordion } from './cost'
import { MaterialCost } from './cost.store'
import { detailStore } from './store'

export const DetailInputs = () => (
  <Stack gap={0.5}>
    <DetailNameInput />
    <DetailDrawingNameInput />
    <DetailPartCodeInput />
    <DetailGroupInput />
    <DetailDescriptionInput />
    <AccordionGroup>
      <DetailParamsInput />
      <ProcessingRouteAccordion />
      <AutomaticWriteoffAccordion />
    </AccordionGroup>
  </Stack>
)

export const MaterialSelect = observer(
  (props: { value: MaterialCost; index: number }) => (
    <MaterialAutocomplete
      size="sm"
      data={cache.materials.getMaterials().map(e => {
        return new MaterialCost({
          material_id: e.id
        })
      })}
      value={props.value}
      onChange={m => {
        if (m) {
          detailStore.updateMaterialRelation(
            props.index,
            { id: m.materialId },
            {
              length: m.length
            }
          )
        }
      }}
    />
  )
)

const DetailNameInput = observer(() => (
  <Input
    label="Название со склада"
    onChange={v => {
      detailStore.setName(v)
    }}
    value={detailStore.name}
  />
))

const DetailDrawingNameInput = observer(() => (
  <Input
    label="Название чертежа"
    onChange={v => {
      detailStore.setDrawingName(v)
    }}
    value={detailStore.drawingName}
  />
))

const DetailDescriptionInput = observer(() => (
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

const DetailPartCodeInput = observer(() => (
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
  <AccordionCard title="Тех. параметры" defaultExpanded>
    <ArrayJsonEditor
      value={detailStore.technicalParameters?.arr ?? null}
      onChange={parameters =>
        detailStore.setTechnicalParameters(
          parameters ? { arr: parameters } : null
        )
      }
      newItem={{ key: '', value: '' }}
      placeholders={['Параметр', 'Значение']}
      width={[70, 30]}
    />
  </AccordionCard>
))

export const ProcessingRouteAccordion = observer(() => (
  <AccordionCard title="Маршрут обработки" defaultExpanded>
    <ArrayJsonEditor
      value={
        detailStore.processingRoute?.steps?.map(e => ({
          name: e.name,
          dur: e.dur
        })) ?? null
      }
      newItem={{
        name: '',
        dur: null
      }}
      onChange={steps =>
        detailStore.setProcessingRoute(steps ? { steps } : null)
      }
      placeholders={['Операция', 'мин']}
      width={[80, 20]}
    />
  </AccordionCard>
))
