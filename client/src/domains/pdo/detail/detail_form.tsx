/** @jsxImportSource @emotion/react */

import { AccordionCard } from '@/components/accordion_card'
import { ArrayJsonEditor } from '@/components/array-json-editor'
import {
  BaseAutocomplete,
  type BaseOption,
} from '@/components/base-autocomplete'
import { dictManager } from '@/components/dict_manager'
import { HoverReveal } from '@/components/hidden_button'
import { NumberInput } from '@/components/inputs/number_input'
import { TextEditor } from '@/domains/orders/one/comments/text-editor'
import { app_cache } from '@/domains/pdo/cache'
import { rpc } from '@/lib/deps'
import {
  Box,
  InputLabled,
  Label,
  MinusIcon,
  MultilineInput,
  P,
  PlusIcon,
  Row,
  type InputLabledProps,
} from '@/lib/index'
import type { Blank } from '@/server/domains/pdo/details_rpc'
import { DictEntry } from '@/server/lib/create_dict_router'
import {
  AccordionGroup,
  Divider,
  Grid,
  Stack,
  type StackProps,
  type TypographySystem,
} from '@mui/joy'
import { observer } from 'mobx-react-lite'
import type { ReactNode } from 'react'
import { DetailAttachmentList } from './attachment/list'
import { type DetailSt, type DetailStProp } from './detail.state'
import {
  DetailRequirementInput,
  MaterialRequirementInput,
} from './detail_blank'

export const DetailForm = observer(
  ({ detail, leftChildren }: DetailStProp & { leftChildren?: ReactNode }) => (
    <Grid container direction={{ xs: 'column', md: 'row' }} spacing={1}>
      <Grid xs={12} md={7}>
        <MultilineInput
          sx={{ fontWeight: 500, width: '100%' }}
          color="primary"
          label="Название со склада"
          onChange={e => {
            detail.setName(e.target.value)
          }}
          value={detail.name}
        />
        <MultilineInput
          sx={{ width: '100%' }}
          label="Название чертежа"
          value={detail.drawing_name}
          onChange={e => {
            detail.set_drawing_name(e.target.value)
          }}
        />
        <Input
          label="Номер чертежа"
          onChange={v => {
            detail.set_drawing_number(v)
            if (v.startsWith('ВЗИС')) {
              alert('Впишите конструкторский номер без приставки "ВЗИС"')
            }
          }}
          value={detail.drawing_number}
        />
        <DetailGroupInput detail={detail} />
        <Row alignItems={'end'}>
          <StockLocationInput detail={detail} />
          <DetailRecommendedBatchSizeInput detail={detail} />
        </Row>
        <DetailDescriptionInput detail={detail} />
        {leftChildren}
      </Grid>
      <Grid xs={12} md={5}>
        <DetailAccordionGroup d={detail} />
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
        detail.set_description(content)
      }}
    />
  </Box>
))

const DetailRecommendedBatchSizeInput = observer(
  ({ detail }: { detail: DetailSt }) => (
    <NumberInput
      label="Рекоменд. размер партии"
      value={detail.recommended_batch_size}
      onChange={v => {
        detail.set_recommended_batch_size(v)
      }}
    />
  ),
)

const StockLocationInput = observer(({ detail }: { detail: DetailSt }) => (
  <Input
    label="Адрес на складе"
    value={detail.stock_location}
    onChange={v => detail.set_stock_location(v)}
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
          detail.set_group_id(group?.value || null)
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

    const openDict = (onClick: (entry: DictEntry) => void) => {
      dictManager.open({
        ls: () =>
          dict.ls.query().then(res => {
            app_cache.details.set_dict_processing_operations(res)
            return res
          }),
        add: operation => dict.add.mutate({ v: operation }),
        rm: id => dict.rm.mutate({ id }),
        onClick,
      })
    }

    return (
      <AccordionCard title="Маршрут" defaultExpanded>
        <Stack>
          {detail.processingRoute.operations.map((op, idx) => (
            <HoverReveal
              gap={1}
              noWrap
              key={op.id}
              alignSelf={'start'}
              hiddenComp={
                <MinusIcon onClick={() => detail.processingRoute.remove(idx)} />
              }
            >
              <Label>{idx + 1}</Label>
              <P
                onClick={() =>
                  openDict(entry =>
                    detail.processingRoute.update(idx, entry.id),
                  )
                }
              >
                {op.name}
              </P>
            </HoverReveal>
          ))}
          <PlusIcon
            onClick={() =>
              openDict(entry => detail.processingRoute.add(entry.id))
            }
          />
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
