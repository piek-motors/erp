/** @jsxImportSource @emotion/react */
import {
  AccordionGroup,
  Button,
  Divider,
  Grid,
  Stack,
  StackProps,
  type TypographySystem,
} from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ArrayJsonEditor } from 'components/array-json-editor'
import { BaseAutocomplete, type BaseOption } from 'components/base-autocomplete'
import { dictManager } from 'components/dict_manager'
import { HoverReveal } from 'components/hidden_button'
import { NumberInput } from 'components/inputs/number_input'
import { TextEditor } from 'domains/orders/one/comments/text-editor'
import { app_cache } from 'domains/pdo/cache'
import { rpc } from 'lib/deps'
import {
  Box,
  InputLabled,
  type InputLabledProps,
  Label,
  MinusIcon,
  MultilineInput,
  observer,
  PlusIcon,
  Row,
} from 'lib/index'
import type { ReactNode } from 'react'
import { Blank } from 'srv/domains/pdo/details_rpc'
import { DetailAttachmentList } from './attachment/list'
import type { DetailSt, DetailStProp } from './detail.state'
import {
  DetailRequirementInput,
  MaterialRequirementInput,
} from './detail_blank'

export const DetailForm = observer(
  ({
    detail: d,
    leftChildren,
  }: DetailStProp & { leftChildren?: ReactNode }) => (
    <Grid container direction={{ xs: 'column', md: 'row' }} spacing={1}>
      <Grid xs={12} md={7}>
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
        {leftChildren}
      </Grid>
      <Grid xs={12} md={5}>
        <DetailAccordionGroup d={d} />
      </Grid>
    </Grid>
  ),
)

export const DetailAccordionGroup = observer(({ d }: { d: DetailSt }) => (
  <AccordionGroup>
    <DetailAttachmentInput detail={d} />
    <BlankAttributesInput detail={d} />
    <ProcessingRouteAccordion detail={d} />
  </AccordionGroup>
))

export const MaterialSelect = observer(
  (props: { value?: number; index: number; onChange: (m: number) => void }) => {
    const { value, onChange } = props
    const options: BaseOption[] =
      app_cache.materials.getMaterials()?.map(material => ({
        label: app_cache.materials.get(material.id)?.label || '',
        value: material.id,
      })) || []

    return (
      <BaseAutocomplete
        size={'sm'}
        options={options}
        placeholder="Выберите материал"
        value={
          value
            ? {
                label: app_cache.materials.getLabel(value) || '',
                value,
              }
            : null
        }
        onChange={newValue => {
          if (newValue && !Array.isArray(newValue)) {
            onChange(newValue.value)
          }
        }}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.label
        }
        isOptionEqualToValue={(option, value) =>
          option.value.id === value.value.id
        }
      />
    )
  },
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
  ),
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
  const groupOptions: BaseOption[] = app_cache.detailGroups
    .getGroups()
    .map(group => ({
      label: group.name,
      value: group.id,
    }))

  const selectedGroup =
    groupOptions.find(option => option.value === detail.group_id) || null

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

const BlankAttributesInput = observer(({ detail }: { detail: DetailSt }) => (
  <AccordionCard title="Заготовка" defaultExpanded>
    <MaterialRequirementInput detail={detail} />
    <Divider sx={{ my: 0.5 }} />
    <DetailRequirementInput detail={detail} />
    <Divider sx={{ my: 0.5 }} />
    <Label color="primary">Атрибуты</Label>
    <ArrayJsonEditor
      value={detail.blank.attributes}
      onChange={attributes => detail.blank.set_attributes(attributes ?? [])}
      newItem={{ key: '', value: '' }}
      placeholders={['Название', 'Значение']}
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
                        app_cache.details.set_dict_processing_operations(res)
                        return res
                      }),
                    add: operation => dict.add.mutate({ v: operation }),
                    rm: id => dict.rm.mutate({ id }),
                    onClick: operation => {
                      op.setId(operation.id)
                    },
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
  },
)

export const BlankAttributes = observer(
  (props: {
    attributes?: Blank['attributes'] | null
    level?: keyof TypographySystem
    fontSize?: number
    rowProps?: StackProps
  }) => (
    <>
      {!!props.attributes?.length && props.attributes.length > 0 && (
        <Row
          flexWrap={'wrap'}
          justifyContent={'left'}
          {...props.rowProps}
          gap={1}
        >
          {props.attributes?.map(({ key, value }, idx) => (
            <Box
              pr={1}
              key={key + idx}
              fontSize={props.fontSize}
              whiteSpace={'nowrap'}
              sx={{ lineHeight: 0.8 }}
            >
              {key}
              {value && ' ' + String(value)}
            </Box>
          ))}
        </Row>
      )}
    </>
  ),
)
