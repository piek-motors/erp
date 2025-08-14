import { UilMinus } from '@iconscout/react-unicons'
import { Divider, IconButton, Stack } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { QtyInputWithUnit } from 'domains/metalflow/shared'
import {
  Box,
  Label,
  P,
  PlusIcon,
  Row,
  Sheet,
  UseIcon,
  observer
} from 'lib/index'
import { EnUnit } from 'models'
import { cache } from '../../cache/root'
import { api } from '../api'
import { MaterialSelect } from '../components'
import { DetailSelectModal } from '../list/list'

interface CostRowProps {
  children: React.ReactNode
  onDelete: () => void
  qtyInput: React.ReactNode
}

const CostRow = ({ children, onDelete, qtyInput: input }: CostRowProps) => (
  <Row justifyContent={'space-between'}>
    <Row gap={0.5}>{children}</Row>
    <Row>
      {input}
      <IconButton variant="soft" color="danger" size="sm" onClick={onDelete}>
        <UseIcon icon={UilMinus} />
      </IconButton>
    </Row>
  </Row>
)

export const MaterialCostInputs = observer(() => (
  <Base
    label="Расход материалов"
    handleAdd={() => {
      api.detail.autoWriteoff.insertMaterialCost()
    }}
    hideAddButton={api.detail.autoWriteoff.materialsCost.length >= 1}
  >
    {api.detail.autoWriteoff.materialsCost.map((materialCost, index) => (
      <CostRow
        key={materialCost.materialId}
        onDelete={() =>
          api.detail.autoWriteoff.deleteMaterial(materialCost.materialId)
        }
        qtyInput={
          <QtyInputWithUnit
            size="sm"
            placeholder="Расход"
            sx={{ width: '80px' }}
            unitId={EnUnit.MilliMeter}
            value={materialCost.length}
            setValue={v => {
              materialCost.setLength(v)
            }}
          />
        }
      >
        <MaterialSelect
          value={materialCost}
          index={index}
          onChange={cost => {
            api.detail.autoWriteoff.updateMaterial(
              index,
              cost.materialId,
              cost.length
            )
          }}
        />
      </CostRow>
    ))}
  </Base>
))

export const AutomaticWriteoffAccordion = observer(() => (
  <AccordionCard title="Расход" defaultExpanded>
    <Stack>
      <Label color="neutral" sx={{ mb: 1 }} level="body-xs">
        Настройте <b>автоматическое списание</b> материалов или деталей при
        запуске детали в производство.
        <br /> Выберите <b>либо расход материала</b>, <b>либо расход деталей</b>
        .
      </Label>
      <MaterialCostInputs />
      <Divider sx={{ my: 0.5 }} />
      <DetailCostInputs />
    </Stack>
  </AccordionCard>
))

export const DetailCostInputs = observer(() => (
  <Base
    label="Расход деталей"
    handleAdd={() => api.detail.autoWriteoff.insertDetail()}
  >
    {api.detail.autoWriteoff.detailsCost.map((cost, index) => (
      <CostRow
        key={index}
        onDelete={() => api.detail.autoWriteoff.deleteDetail(cost.detailId)}
        qtyInput={
          <QtyInputWithUnit
            size="sm"
            sx={{ width: '80px' }}
            unitId={EnUnit.Countable}
            value={cost.qty}
            setValue={v => {
              cost.setQty(v)
            }}
          />
        }
      >
        {cost.detailId ? (
          <P>
            <Label>{cost.detailId}</Label>{' '}
            {cache.details.getLabel(cost.detailId) ?? 'Выберите деталь'}
          </P>
        ) : (
          <DetailSelectModal
            onRowClick={detail => {
              cost.setDetailId(detail.id!)
            }}
          />
        )}
      </CostRow>
    ))}
  </Base>
))

interface BaseProps {
  label: string
  children?: React.ReactNode
  handleAdd: () => void
  hideAddButton?: boolean
}

const Base = (props: BaseProps) => (
  <Box>
    <Label color="primary">{props.label}</Label>
    <Sheet sx={{ borderRadius: 'sm', p: 1 }}>
      <Stack gap={1}>{props.children}</Stack>
      <Box>
        {!props.hideAddButton && <PlusIcon onClick={() => props.handleAdd()} />}
      </Box>
    </Sheet>
  </Box>
)
