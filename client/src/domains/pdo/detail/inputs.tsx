/** @jsxImportSource @emotion/react */
import { AccordionGroup, Button, Grid, Stack, TypographySystem } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ArrayJsonEditor } from 'components/array-json-editor'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { dictManager } from 'components/dict_manager'
import { HoverReveal } from 'components/hidden_button'
import { NumberInput } from 'components/inputs/number_input'
import { TextEditor } from 'domains/orders/one/comments/text-editor'
import { cache } from 'domains/pdo/cache/root'
import { rpc } from 'lib/deps'
import {
  Box,
  InputLabled,
  InputLabledProps,
  Label,
  MinusIcon,
  MultilineInput,
  observer,
  P,
  PlusIcon,
  Row
} from 'lib/index'
import { MetalPageTitle } from '../shared'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { DetailAttachmentList } from './attachment/list'
import { BlankSpec, DetailSt, DetailStProp } from './detail.state'
import { AutomaticWriteoffAccordion } from './warehouse/cost'
import { MaterialCost } from './warehouse/cost.store'

export const DetailInputs = observer(({ detail: d }: DetailStProp) => (
  <Grid container direction={{ xs: 'column', md: 'row' }} spacing={1}>
    <Grid xs={12} md={7}>
      <MetalPageTitle
        t={
          Boolean(d.id) && (
            <P level="body-sm" whiteSpace={'nowrap'}>
              Деталь № {d.id}
            </P>
          )
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
    </Grid>
    <Grid xs={12} md={5}>
      <DetailAccordionGroup d={d} />
    </Grid>
  </Grid>
))

export const DetailAccordionGroup = observer(({ d }: { d: DetailSt }) => (
  <AccordionGroup>
    <DetailAttachmentInput detail={d} />
    <BlankSpecInput detail={d} />
    <ProcessingRouteAccordion detail={d} />
    <AutomaticWriteoffAccordion detail={d} />
  </AccordionGroup>
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
        data={data}
        value={props.value}
        onChange={m => {
          props.onChange(m)
        }}
      />
    )
  }
)

const DetailDescriptionInput = observer(({ detail }: { detail: DetailSt }) => (
  <Box>
    <Label>Примечание</Label>
    <TextEditor
      defaultValue={detail.description}
      onChange={content => {
        detail.setDescription(content)
      }}
    />
  </Box>
))

const DetailRecommendedBatchSizeInput = observer(
  ({ detail }: { detail: DetailSt }) => (
    <NumberInput
      label="Рекоменд. размер партии"
      value={detail.recommendedBatchSize}
      onChange={v => {
        detail.setRecommendedBatchSize(v)
      }}
    />
  )
)

const StockLocationInput = observer(({ detail }: { detail: DetailSt }) => (
  <Input
    label="Адрес на складе"
    value={detail.stockLocation}
    onChange={v => detail.setStockLocation(v)}
  />
))

const Input = (props: InputLabledProps) => (
  <InputLabled variant="outlined" color="neutral" {...props} />
)

const DetailGroupInput = observer(({ detail }: { detail: DetailSt }) => {
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

const DetailAttachmentInput = observer(({ detail }: { detail: DetailSt }) => (
  <AccordionCard title="Файлы" defaultExpanded>
    <DetailAttachmentList detail={detail} />
  </AccordionCard>
))

const BlankSpecInput = observer(({ detail }: { detail: DetailSt }) => (
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
  ({ detail }: { detail: DetailSt }) => {
    const dict = rpc.pdo.dict.operation_kinds
    return (
      <AccordionCard title="Маршрут" defaultExpanded>
        <Stack>
          {detail.processingRoute.steps.map((op, idx) => (
            <HoverReveal
              key={op.id}
              alignSelf={'start'}
              hiddenComp={
                <MinusIcon onClick={() => detail.processingRoute.remove(idx)} />
              }
            >
              <Label>{idx + 1}</Label>
              <Button
                variant="plain"
                color="neutral"
                sx={{ fontWeight: 'normal', textAlign: 'left' }}
                onClick={() =>
                  dictManager.open({
                    ls: () =>
                      dict.ls.query().then(res => {
                        cache.details.setDictProcessingOperations(res)
                        return res
                      }),
                    add: operation => dict.add.mutate({ v: operation }),
                    rm: id => dict.rm.mutate({ id }),
                    onClick: operation => {
                      op.setId(operation.id)
                    }
                  })
                }
              >
                {op.name || 'Выбрать'}
              </Button>
            </HoverReveal>
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
