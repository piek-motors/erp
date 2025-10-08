/** @jsxImportSource @emotion/react */
import { AccordionGroup, Stack, TypographySystem } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ArrayJsonEditor } from 'components/array-json-editor'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { cache } from 'domains/metalflow/cache/root'
import { TextEditor } from 'domains/orders/one/comments/text-editor'
import { Box, Inp, Label, MyInputProps, observer, P, Row } from 'lib/index'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { api } from './api'
import { BlankSpec } from './detail.state'
import { AutomaticWriteoffAccordion } from './warehouse/cost'
import { MaterialCost } from './warehouse/cost.store'

export const DetailInputs = () => (
  <Stack gap={0.5}>
    <DetailNameInput />
    <DetailDrawingNameInput />
    <DetailPartCodeInput />
    <DetailGroupInput />
    <DetailRecommendedBatchSizeInput />
    <DetailDescriptionInput />
    <AccordionGroup>
      <BlankSpecInput />
      <ProcessingRouteAccordion />
      <AutomaticWriteoffAccordion />
    </AccordionGroup>
  </Stack>
)

export const MaterialSelect = observer(
  (props: {
    value: MaterialCost
    index: number
    onChange: (m: MaterialCost) => void
  }) => {
    const data = cache.materials.getMaterials().map(
      e =>
        new MaterialCost({
          material_id: e.id,
          length: props.value.length
        })
    )
    return (
      <MaterialAutocomplete
        size="sm"
        data={data}
        value={props.value}
        onChange={m => {
          props.onChange(m)
        }}
      />
    )
  }
)

const DetailNameInput = observer(() => (
  <Input
    label="Название со склада"
    onChange={v => {
      api.detail.setName(v)
    }}
    value={api.detail.name}
  />
))

const DetailDrawingNameInput = observer(() => (
  <Input
    label="Название чертежа"
    onChange={v => {
      api.detail.setDrawingName(v)
    }}
    value={api.detail.drawingName}
  />
))

const DetailDescriptionInput = observer(() => (
  <Box>
    <Label>Примечание</Label>
    <TextEditor
      defaultValue={api.detail.description}
      onChange={content => {
        api.detail.setDescription(content)
      }}
    />
  </Box>
))

const DetailRecommendedBatchSizeInput = observer(() => (
  <Input
    label="Рекомендуемый размер партии"
    type="number"
    sx={{ width: '100px' }}
    value={api.detail.recommendedBatchSize}
    onChange={v => {
      api.detail.setRecommendedBatchSize(v)
    }}
  />
))

const DetailPartCodeInput = observer(() => (
  <Input
    label="Номер чертежа"
    onChange={v => {
      api.detail.setDrawingNumber(v)

      if (v.startsWith('ВЗИС')) {
        alert('Впишите конструкторский номер без приставки "ВЗИС"')
      }
    }}
    value={api.detail.drawingNumber}
  />
))

const Input = (props: MyInputProps) => (
  <Inp variant="plain" color="neutral" fullWidth {...props} />
)

const DetailGroupInput = observer(() => {
  const groupOptions: BaseOption[] = cache.detailGroups
    .getGroups()
    .map(group => ({
      label: group.name,
      value: group.id
    }))

  const selectedGroup =
    groupOptions.find(option => option.value === api.detail.groupId) || null

  return (
    <Stack>
      <Label>Группа детали. Для универсальных деталей оставьте пустым.</Label>
      <BaseAutocomplete
        variant="plain"
        options={groupOptions}
        value={selectedGroup}
        onChange={group => {
          api.detail.setGroupId(group?.value || null)
        }}
      />
    </Stack>
  )
})

const BlankSpecInput = observer(() => (
  <AccordionCard title="Заготовка" defaultExpanded>
    <Label level="body-xs">ﾍ(･_| Материал заготовки указывать не нужно</Label>
    <ArrayJsonEditor
      value={api.detail.blankSpec?.arr ?? null}
      onChange={parameters =>
        api.detail.setBlankSpec(parameters ? { arr: parameters } : null)
      }
      newItem={{ key: '', value: '' }}
      placeholders={['Параметр', 'Значение']}
      width={[70, 30]}
    />
  </AccordionCard>
))

const ProcessingRouteAccordion = observer(() => (
  <AccordionCard title="Маршрут обработки" defaultExpanded>
    <ArrayJsonEditor
      value={api.detail.processingRoute.steps ?? null}
      newItem={{
        name: '',
        dur: null
      }}
      onChange={steps => api.detail.processingRoute.init(steps ?? [])}
      placeholders={['Операция', 'мин']}
      width={[90, 10]}
    />
  </AccordionCard>
))

export const TechParamsDisplay = observer(
  (props: { params?: BlankSpec | null; level: keyof TypographySystem }) => (
    <>
      {!!props.params?.arr?.length && props.params.arr.length > 0 && (
        <Stack width={'max-content'}>
          {props.params?.arr.map(({ key, value }, idx) => (
            <P key={key + idx} level={props.level} sx={{ ml: 0.5 }}>
              {key}: {String(value)}
            </P>
          ))}
        </Stack>
      )}
    </>
  )
)

export const TechParamsRowDisplay = observer(
  (props: {
    params?: BlankSpec | null
    level?: keyof TypographySystem
    fontSize?: number
  }) => (
    <>
      {!!props.params?.arr?.length && props.params.arr.length > 0 && (
        <Row flexWrap={'wrap'} maxWidth={'200px'}>
          {props.params?.arr.map(({ key, value }, idx) => (
            <Box
              key={key + idx}
              fontSize={props.fontSize}
              whiteSpace={'nowrap'}
              sx={{ lineHeight: 0.8 }}
            >
              {key}: {String(value)}
              {idx < props.params!.arr.length - 1 ? ',' : ''}
            </Box>
          ))}
        </Row>
      )}
    </>
  )
)
