/** @jsxImportSource @emotion/react */

import { UilBars } from '@iconscout/react-unicons'
import {
  AccordionGroup,
  Autocomplete,
  Box,
  Divider,
  Grid,
  Stack,
  type StackProps,
  type TypographySystem,
} from '@mui/joy'
import { Observer, observer } from 'mobx-react-lite'
import type { ReactNode } from 'react'
import { AccordionCard } from '@/components/accordion_card'
import { ArrayJsonEditor } from '@/components/array-json-editor'
import type { BaseOption } from '@/components/base-autocomplete'
import { NumberInput } from '@/components/inputs/number_input'
import { Join } from '@/components/join'
import { TextEditor } from '@/domains/orders/one/comments/text-editor'
import { app_cache } from '@/domains/pdo/cache'
import { GroupTreeModal } from '@/domains/pdo/detail_grouping/group_tree_selector'
import {
  IconButtonXxs,
  InputLabled,
  type InputLabledProps,
  Label,
  MultilineInput,
  P,
  Row,
} from '@/lib/index'
import type { Blank } from '@/server/domains/pdo/storage/detail_repo'
import { GroupVisualSeparator } from '../detail_grouping/group_name_preview'
import { DetailAttachmentList } from './attachment/list'
import type { DetailSt, DetailStProp } from './detail.state'
import {
  DetailRequirementInput,
  MaterialRequirementInput,
} from './detail_blank'
import { WorkflowAccordion } from './workflow'

/** Main detail form component with two-column layout. */
export const DetailForm = observer(
  ({ detail, leftChildren }: DetailStProp & { leftChildren?: ReactNode }) => (
    <Grid container direction={{ xs: 'column', md: 'row' }} spacing={1}>
      <Grid xs={12} md={7} py={1}>
        <Stack gap={0.5}>
          <MultilineInput
            sx={{ fontWeight: 500, width: '100%', boxShadow: 'none' }}
            color="primary"
            variant="outlined"
            label="Название"
            onChange={e => detail.setName(e.target.value)}
            value={detail.name}
          />
          <DetailGroupInput detail={detail} />
          <Stack>
            <Label>Чертеж</Label>
            <Row noWrap>
              <MultilineInput
                formProps={{ sx: { flexGrow: 1 } }}
                placeholder="Название"
                value={detail.drawing_name}
                onChange={e => detail.set_drawing_name(e.target.value)}
              />
              <Input
                placeholder="Номер"
                onChange={v => {
                  detail.set_drawing_number(v)
                  if (v.startsWith('ВЗИС'))
                    alert('Впишите конструкторский номер без приставки "ВЗИС"')
                }}
                value={detail.drawing_number}
              />
            </Row>
          </Stack>
          <Row alignItems="end">
            <StockLocationInput detail={detail} />
            <DetailRecommendedBatchSizeInput detail={detail} />
          </Row>
          <DetailDescriptionInput detail={detail} />
          {leftChildren}
        </Stack>
      </Grid>
      <Grid xs={12} md={5}>
        <DetailAccordionGroup d={detail} />
      </Grid>
    </Grid>
  ),
)

/** Accordion group containing detail attachments, blank attributes, and workflow. */
export const DetailAccordionGroup = observer(({ d }: { d: DetailSt }) => (
  <AccordionGroup>
    <DetailAttachmentInput detail={d} />
    <BlankAttributesInput detail={d} />
    <WorkflowAccordion detail={d} />
  </AccordionGroup>
))

/** Material selection autocomplete component. */
export const MaterialSelect = observer(
  (props: { value?: number; index: number; onChange: (m: number) => void }) => {
    const { value: material, onChange } = props
    const options: BaseOption[] =
      app_cache.materials.materials.map(m => ({
        label: app_cache.materials.get(m.id)?.label || '',
        value: m.id,
      })) || []

    return (
      <Autocomplete
        size="sm"
        options={options}
        placeholder="Выберите материал"
        value={
          material
            ? {
                label: app_cache.materials.label_for(material) || '',
                value: material,
              }
            : null
        }
        onChange={(_, newValue) => {
          if (newValue && !Array.isArray(newValue)) onChange(newValue.value)
        }}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.label
        }
        isOptionEqualToValue={(option, value) => option.value === value.value}
      />
    )
  },
)

/** Detail description rich text editor input. */
const DetailDescriptionInput = observer(({ detail }: { detail: DetailSt }) => (
  <Box>
    <Label>Примечание</Label>
    <TextEditor
      defaultValue={detail.description}
      onChange={content => detail.set_description(content)}
    />
  </Box>
))

/** Recommended batch size numeric input. */
const DetailRecommendedBatchSizeInput = observer(
  ({ detail }: { detail: DetailSt }) => (
    <NumberInput
      size="md"
      label="Рекоменд. размер партии"
      value={detail.recommended_batch_size}
      onChange={v => detail.set_recommended_batch_size(v)}
    />
  ),
)

/** Stock location text input. */
const StockLocationInput = observer(({ detail }: { detail: DetailSt }) => (
  <Input
    label="Адрес на складе"
    value={detail.stock_location}
    onChange={v => detail.set_stock_location(v)}
  />
))

/** Labeled input wrapper with outlined variant. */
const Input = (props: InputLabledProps) => (
  <InputLabled variant="outlined" color="neutral" {...props} />
)

/** Group selection input using tree modal. */
const DetailGroupInput = observer(({ detail }: { detail: DetailSt }) => (
  <Stack>
    <Label>Группы</Label>
    <Row>
      <GroupTreeModal
        group_assigment={detail.group_assigment}
        open_button={
          <IconButtonXxs
            size="sm"
            variant="outlined"
            sx={{ width: 'fit-content', my: 0.5 }}
            icon={UilBars}
          />
        }
      />

      <P color="primary" lineHeight={1.3}>
        <Join
          items={detail.group_assigment.group_ids}
          separator={
            <Box component="span" color="black">
              {GroupVisualSeparator}
            </Box>
          }
          getKey={id => id}
          render={id => (
            <Observer
              render={() => (
                <>{app_cache.groups.tree.full_node_name(id) ?? '-'}</>
              )}
            />
          )}
        />
      </P>
    </Row>
  </Stack>
))

/** Detail attachments accordion section. */
const DetailAttachmentInput = observer(({ detail }: { detail: DetailSt }) => (
  <AccordionCard title="Файлы" defaultExpanded>
    <DetailAttachmentList detail={detail} />
  </AccordionCard>
))

/** Blank attributes accordion section with material and detail requirements. */
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

/** Blank attributes display component with configurable styling. */
export const BlankAttributes = observer(
  (props: {
    attributes?: Blank['attributes'] | null
    level?: keyof TypographySystem
    fontSize?: number
    rowProps?: StackProps
  }) => (
    <>
      {!!props.attributes?.length && props.attributes.length > 0 && (
        <Row flexWrap="wrap" justifyContent="left" {...props.rowProps} gap={1}>
          {props.attributes?.map(({ key, value }) => (
            <Box
              pr={1}
              key={key + value}
              fontSize={props.fontSize}
              whiteSpace="nowrap"
              sx={{ lineHeight: 0.8 }}
            >
              {key}
              {value && ` ${String(value)}`}
            </Box>
          ))}
        </Row>
      )}
    </>
  ),
)
