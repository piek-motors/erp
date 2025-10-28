/** @jsxImportSource @emotion/react */
import { AccordionGroup, Stack, TypographySystem } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ArrayJsonEditor } from 'components/array-json-editor'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { NumberInput } from 'components/inputs/number_input'
import { TextEditor } from 'domains/orders/one/comments/text-editor'
import { cache } from 'domains/pdo/cache/root'
import { Box, Inp, Label, MyInputProps, observer, P, Row } from 'lib/index'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { BlankSpec, DetailState } from './detail.state'
import { AutomaticWriteoffAccordion } from './warehouse/cost'
import { MaterialCost } from './warehouse/cost.store'

export const DetailInputs = ({ detail: d }: { detail: DetailState }) => (
  <Stack gap={0.5}>
    <DetailNameInput detail={d} />
    <DetailDrawingNameInput detail={d} />
    <DetailPartCodeInput detail={d} />
    <DetailGroupInput detail={d} />
    <DetailRecommendedBatchSizeInput detail={d} />
    <DetailDescriptionInput detail={d} />
    <AccordionGroup>
      <BlankSpecInput detail={d} />
      <ProcessingRouteAccordion detail={d} />
      <AutomaticWriteoffAccordion detail={d} />
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

const DetailNameInput = observer(({ detail }: { detail: DetailState }) => (
  <Input
    size="lg"
    variant="plain"
    color="primary"
    sx={{ fontWeight: 500 }}
    label="Название со склада"
    onChange={v => {
      detail.setName(v)
    }}
    value={detail.name}
  />
))

const DetailDrawingNameInput = observer(
  ({ detail }: { detail: DetailState }) => (
    <Input
      label="Название чертежа"
      onChange={v => {
        detail.setDrawingName(v)
      }}
      value={detail.drawingName}
    />
  )
)

const DetailDescriptionInput = observer(
  ({ detail }: { detail: DetailState }) => (
    <Box>
      <Label>Примечание</Label>
      <TextEditor
        defaultValue={detail.description}
        onChange={content => {
          detail.setDescription(content)
        }}
      />
    </Box>
  )
)

const DetailRecommendedBatchSizeInput = observer(
  ({ detail }: { detail: DetailState }) => (
    <NumberInput
      label="Рекомендуемый размер партии"
      value={detail.recommendedBatchSize}
      onChange={v => {
        detail.setRecommendedBatchSize(v)
      }}
    />
  )
)

const DetailPartCodeInput = observer(({ detail }: { detail: DetailState }) => (
  <Input
    label="Номер чертежа"
    onChange={v => {
      detail.setDrawingNumber(v)

      if (v.startsWith('ВЗИС')) {
        alert('Впишите конструкторский номер без приставки "ВЗИС"')
      }
    }}
    value={detail.drawingNumber}
  />
))

const Input = (props: MyInputProps) => (
  <Inp variant="plain" color="neutral" fullWidth {...props} />
)

const DetailGroupInput = observer(({ detail }: { detail: DetailState }) => {
  const groupOptions: BaseOption[] = cache.detailGroups
    .getGroups()
    .map(group => ({
      label: group.name,
      value: group.id
    }))

  const selectedGroup =
    groupOptions.find(option => option.value === detail.groupId) || null

  return (
    <Stack>
      <Label>Группа детали. Для универсальных деталей оставьте пустым.</Label>
      <BaseAutocomplete
        variant="plain"
        options={groupOptions}
        value={selectedGroup}
        onChange={group => {
          detail.setGroupId(group?.value || null)
        }}
      />
    </Stack>
  )
})

const BlankSpecInput = observer(({ detail }: { detail: DetailState }) => (
  <AccordionCard title="Заготовка" defaultExpanded>
    <Label level="body-xs">Материал заготовки указывать не нужно</Label>
    <ArrayJsonEditor
      value={detail.blankSpec?.arr ?? null}
      onChange={parameters =>
        detail.setBlankSpec(parameters ? { arr: parameters } : null)
      }
      newItem={{ key: '', value: '' }}
      placeholders={['Параметр', 'Значение']}
      width={[70, 30]}
    />
  </AccordionCard>
))

const ProcessingRouteAccordion = observer(
  ({ detail }: { detail: DetailState }) => (
    <AccordionCard title="Маршрут обработки" defaultExpanded>
      <ArrayJsonEditor
        value={detail.processingRoute.steps ?? null}
        newItem={{
          name: ''
        }}
        onChange={steps => detail.processingRoute.init(steps ?? [])}
        placeholders={['Операция', 'мин']}
        width={[90, 10]}
      />
    </AccordionCard>
  )
)

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
        <Row flexWrap={'wrap'} justifyContent={'center'}>
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
