/** @jsxImportSource @emotion/react */
import { AccordionGroup, Sheet, Stack, TypographySystem } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ArrayJsonEditor } from 'components/array-json-editor'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { NumberInput } from 'components/inputs/number_input'
import { TextEditor } from 'domains/orders/one/comments/text-editor'
import { cache } from 'domains/pdo/cache/root'
import {
  Box,
  Inp,
  Label,
  MinusIcon,
  MultilineInput,
  MyInputProps,
  observer,
  P,
  PlusIcon,
  Row
} from 'lib/index'
import { MetalPageTitle } from '../shared'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { DetailAttachmentList } from './attachment/list'
import { BlankSpec, DetailState, Operation } from './detail.state'
import { AutomaticWriteoffAccordion } from './warehouse/cost'
import { MaterialCost } from './warehouse/cost.store'

export const DetailInputs = observer(
  ({ detail: d }: { detail: DetailState }) => (
    <Stack
      pr={{ xs: 0, md: 4 }}
      direction={{ xs: 'column', md: 'row' }}
      gap={1}
    >
      <Box sx={{ flexGrow: 1.5 }}>
        <MetalPageTitle
          t={
            <P level="body-sm" whiteSpace={'nowrap'}>
              Деталь № {d.id}
            </P>
          }
        />
        <MultilineInput
          sx={{ fontWeight: 500, width: '100%' }}
          color="primary"
          label="Название со склада"
          onChange={e => {
            d.setName(e.target.value)
          }}
          value={d.name}
        />
        <MultilineInput
          sx={{ width: '100%' }}
          label="Название чертежа"
          onChange={e => {
            d.setDrawingName(e.target.value)
          }}
          value={d.drawingName}
        />
        <Input
          label="Номер чертежа"
          onChange={v => {
            d.setDrawingNumber(v)
            if (v.startsWith('ВЗИС')) {
              alert('Впишите конструкторский номер без приставки "ВЗИС"')
            }
          }}
          value={d.drawingNumber}
        />
        <DetailGroupInput detail={d} />
        <Row alignItems={'end'}>
          <StockLocationInput detail={d} />
          <DetailRecommendedBatchSizeInput detail={d} />
        </Row>
        <DetailDescriptionInput detail={d} />
      </Box>
      <DetailAccordionGroup d={d} />
    </Stack>
  )
)

export const DetailAccordionGroup = observer(({ d }: { d: DetailState }) => (
  <Sheet>
    <AccordionGroup>
      <DetailAttachmentInput detail={d} />
      <BlankSpecInput detail={d} />
      <ProcessingRouteAccordion detail={d} />
      <AutomaticWriteoffAccordion detail={d} />
    </AccordionGroup>
  </Sheet>
))

export const MaterialSelect = observer(
  (props: {
    value: MaterialCost
    index: number
    onChange: (m: MaterialCost) => void
  }) => {
    const data = cache.materials
      .getMaterials()
      .map(e => new MaterialCost([e.id, props.value.length ?? 0]))
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

const StockLocationInput = observer(({ detail }: { detail: DetailState }) => (
  <Input
    label="Адрес на складе"
    value={detail.stockLocation}
    onChange={v => detail.setStockLocation(v)}
  />
))

const Input = (props: MyInputProps) => (
  <Inp variant="outlined" color="neutral" {...props} />
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
        variant="outlined"
        options={groupOptions}
        value={selectedGroup}
        onChange={group => {
          detail.setGroupId(group?.value || null)
        }}
      />
    </Stack>
  )
})

const DetailAttachmentInput = observer(
  ({ detail }: { detail: DetailState }) => (
    <AccordionCard title="Файлы" defaultExpanded>
      <DetailAttachmentList detail={detail} />
    </AccordionCard>
  )
)

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

const ProcessingOperationAutocomplete = observer(
  (props: { operation: Operation }) => {
    const { operation: op } = props
    return (
      <BaseAutocomplete
        width={'100%'}
        variant="plain"
        options={cache.details.dictProcessingOperaions.map(e => ({
          label: e,
          value: e
        }))}
        value={{
          value: op.name,
          label: op.name
        }}
        onChange={newValue => {
          if (newValue && !Array.isArray(newValue)) {
            op.setName(newValue.value)
          } else {
            op.setName('')
          }
        }}
        placeholder="Такая-то обработка"
        size="sm"
        freeSolo
        loading={!!cache.details.dictProcessingOperaions.length}
      />
    )
  }
)

const ProcessingRouteAccordion = observer(
  ({ detail }: { detail: DetailState }) => {
    return (
      <AccordionCard title="Маршрут" defaultExpanded>
        <Stack gap={0.5}>
          {detail.processingRoute.steps.map((op, idx) => (
            <Row>
              <Label>{idx + 1}</Label>
              <ProcessingOperationAutocomplete key={idx} operation={op} />
              <MinusIcon onClick={() => detail.processingRoute.remove(idx)} />
            </Row>
          ))}
          <PlusIcon onClick={() => detail.processingRoute.addEmpty()} />
        </Stack>
      </AccordionCard>
    )
  }
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
