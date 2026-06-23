/** @jsxImportSource @emotion/react */

import {
  UilBars,
  UilFileEditAlt,
  UilPaperclip,
  UilReceiptAlt,
} from '@iconscout/react-unicons'
import {
  AccordionGroup,
  Autocomplete,
  Box,
  Divider,
  Stack,
  type StackProps,
  type TypographySystem,
} from '@mui/joy'
import { Observer, observer } from 'mobx-react-lite'
import { AccordionCard } from '@/components/accordion_card'
import { ArrayJsonEditor } from '@/components/array-json-editor'
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
import { MaterialName } from '../material/name'
import { DetailAttachmentList } from './attachment/list'
import type { DetailSt, DetailStProp } from './detail.state'
import {
  DetailRequirementInput,
  MaterialRequirementInput,
} from './detail_blank'
import { DetailWarehouseButtons } from './warehouse/ui'
import { WorkflowAccordion } from './workflow'

export const DetailForm = observer(({ detail }: DetailStProp) => (
  <Stack gap={0.5} p={1} pt={0}>
    <Row>
      <DetailNameInput detail={detail} />
      <DetailGroupInput detail={detail} />
    </Row>
    <DetailAccordionGroup d={detail} />
  </Stack>
))

const DetailNameInput = observer(({ detail }: DetailStProp) => (
  <Stack
    sx={{
      flex: '0 1 max-content',
      maxWidth: '100%',
      minWidth: 0,
    }}
  >
    <Label>Название</Label>
    <Box
      data-value={detail.name || ' '}
      sx={{
        color: 'primary.plainColor',
        display: 'grid',
        fontWeight: 500,
        overflowWrap: 'anywhere',
        typography: 'body-lg',
        whiteSpace: 'pre-wrap',
        '&::after': {
          content: 'attr(data-value) " "',
          gridArea: '1 / 1',
          visibility: 'hidden',
        },
      }}
    >
      <Box
        component="textarea"
        rows={1}
        onChange={e => detail.setName(e.target.value)}
        value={detail.name}
        sx={{
          background: 'transparent',
          border: 0,
          font: 'inherit',
          gridArea: '1 / 1',
          minWidth: 0,
          outline: 0,
          overflow: 'hidden',
          padding: 0,
          resize: 'none',
          width: '100%',
        }}
      />
    </Box>
  </Stack>
))

/** Accordion group containing detail attachments, blank attributes, workflow, and warehouse. */
export const DetailAccordionGroup = observer(({ d }: { d: DetailSt }) => (
  <AccordionGroup>
    <WarehouseAccordion detail={d} />
    <PlanningDispatchAccordion detail={d} />
    <DetailAttachmentInput detail={d} />
    <BlankInput detail={d} />
    <WorkflowAccordion detail={d} />
  </AccordionGroup>
))

/** Material selection autocomplete component. */
export const MaterialSelect = observer(
  (props: { value?: number; index: number; onChange: (m: number) => void }) => {
    const { value: material, onChange } = props
    const options = app_cache.materials.materials_sorted.map(material => ({
      label: [material.label, material.alloy].filter(Boolean).join(' '),
      value: material.id,
      material,
    }))
    const value = options.find(option => option.value === material) ?? null

    return (
      <Autocomplete
        size="sm"
        options={options}
        placeholder="Выберите материал"
        value={value}
        onChange={(_, newValue) => {
          if (newValue && !Array.isArray(newValue)) onChange(newValue.value)
        }}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.label
        }
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{ px: 1, py: 0.5, cursor: 'pointer' }}
          >
            <MaterialName
              material={option.material}
              disableLink
              slotProps={{ level: 'body-sm', sx: { color: 'black' } }}
            />
          </Box>
        )}
      />
    )
  },
)

/** Accordion with planning and dispatching information. */
const PlanningDispatchAccordion = observer(
  ({ detail }: { detail: DetailSt }) => (
    <AccordionCard
      title="Чертеж и примечание"
      icon={UilFileEditAlt}
      defaultExpanded
    >
      <Stack gap={0.5}>
        <Stack>
          <Label>Чертеж</Label>
          <Row>
            <MultilineInput
              size="sm"
              formProps={{ sx: { flexGrow: 1 } }}
              placeholder="Название"
              value={detail.drawing_name}
              onChange={e => detail.set_drawing_name(e.target.value)}
            />
            <Input
              size="sm"
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
          <DetailRecommendedBatchSizeInput detail={detail} />
        </Row>
        <DetailDescriptionInput detail={detail} />
      </Stack>
    </AccordionCard>
  ),
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
      size="sm"
      label="Рекоменд. размер партии"
      value={detail.recommended_batch_size}
      onChange={v => detail.set_recommended_batch_size(v)}
    />
  ),
)

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
  <AccordionCard title="Файлы" icon={UilPaperclip} defaultExpanded>
    <DetailAttachmentList detail={detail} />
  </AccordionCard>
))

/** Blank attributes accordion section with material and detail requirements. */
const BlankInput = observer(({ detail }: { detail: DetailSt }) => (
  <AccordionCard title="Заготовка" icon={UilReceiptAlt} defaultExpanded>
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

/** Warehouse accordion with stock, operations, quarterly stock, and address. */
const WarehouseAccordion = observer(({ detail }: { detail: DetailSt }) => (
  <AccordionCard
    title="Склад"
    iconNode={
      <img
        src="/icons/warehouse.svg"
        width={15}
        height={15}
        style={{ opacity: 0.5 }}
      />
    }
    defaultExpanded
  >
    <Stack gap={1.5}>
      <DetailWarehouseButtons detail={detail} />
      <Row>
        <Stack gap={0.5}>
          <Input
            size="sm"
            label="Адрес"
            placeholder="А-1-2-2-4"
            value={detail.stock_location}
            error={detail.show_stock_location_error}
            onChange={v => detail.set_stock_location(v)}
          />
          {detail.show_stock_location_error && (
            <P level="body-xs" color="danger">
              Неверный формат адреса
            </P>
          )}
          <P level="body-xs" color="neutral">
            Склад – ряд - секция - полка - ячейка
          </P>
        </Stack>
        <NumberInput
          size="sm"
          label="Нормативный запас"
          value={detail.safe_stock_leftover}
          onChange={v => detail.set_safe_stock_leftover(v)}
        />
      </Row>
    </Stack>
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
