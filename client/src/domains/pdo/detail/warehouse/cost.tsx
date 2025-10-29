import { UilLink, UilMinus } from '@iconscout/react-unicons'
import { Divider, IconButton, Stack } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ExtraSmallIconButton } from 'components/buttons'
import { cache } from 'domains/pdo/cache/root'
import { QtyInputWithUnit } from 'domains/pdo/shared'
import {
  Box,
  Label,
  PlusIcon,
  Row,
  Sheet,
  UseIcon,
  observer,
  routeMap
} from 'lib/index'
import { openPage } from 'lib/routes'
import { Unit } from 'models'
import { MaterialSelect } from '../components'
import { DetailState } from '../detail.state'
import { DetailSelectModal } from '../list/list'
import { DetailName } from '../name'

interface CostRowProps {
  children: React.ReactNode
  onDelete: () => void
  qtyInput: React.ReactNode
}

const CostRow = ({ children, onDelete, qtyInput: input }: CostRowProps) => (
  <Row>
    <Row gap={0.5}>{children}</Row>
    <Row>
      {input}
      <IconButton variant="soft" color="danger" size="sm" onClick={onDelete}>
        <UseIcon icon={UilMinus} />
      </IconButton>
    </Row>
  </Row>
)

export const MaterialCostInputs = observer(
  ({ detail }: { detail: DetailState }) => {
    const materialCost = detail.autoWriteoff.materialCost
    return (
      <Base
        label="Расход материала"
        handleAdd={() => {
          detail.autoWriteoff.insertMaterialCost()
        }}
        hideAddButton={!!materialCost}
      >
        {materialCost && (
          <CostRow
            key={materialCost.materialId}
            onDelete={() => detail.autoWriteoff.setMaterialCost(null)}
            qtyInput={
              <QtyInputWithUnit
                size="sm"
                placeholder="Расход"
                sx={{ width: '80px' }}
                unitId={Unit.MilliMeter}
                value={materialCost.length}
                setValue={v => {
                  materialCost.setLength(v)
                }}
              />
            }
          >
            <Row>
              <MaterialSelect
                value={materialCost}
                index={0}
                onChange={cost => {
                  detail.autoWriteoff.updateMaterial(
                    cost.materialId,
                    cost.length
                  )
                }}
              />
              <ExtraSmallIconButton
                link={openPage(
                  routeMap.pdo.material.edit,
                  materialCost.materialId
                )}
                icon={UilLink}
              />
            </Row>
          </CostRow>
        )}
      </Base>
    )
  }
)

export const AutomaticWriteoffAccordion = observer(
  ({ detail }: { detail: DetailState }) => (
    <AccordionCard title="Расход" defaultExpanded>
      <Stack>
        <Label color="neutral" sx={{ mb: 1 }} level="body-xs">
          Настройте <b>автоматическое списание</b> материалов или деталей при
          запуске детали в производство.
          <br /> Выберите <b>либо расход материала</b>,{' '}
          <b>либо расход деталей</b>.
        </Label>
        <MaterialCostInputs detail={detail} />
        <Divider sx={{ my: 0.5 }} />
        <DetailCostInputs detail={detail} />
      </Stack>
    </AccordionCard>
  )
)

export const DetailCostInputs = observer(
  ({ detail }: { detail: DetailState }) => (
    <Base
      label="Расход деталей"
      handleAdd={() => detail.autoWriteoff.insertDetail()}
    >
      {detail.autoWriteoff.detailsCost.map((cost, index) => {
        const detail = cache.details.get(cost.detailId)
        if (!detail) {
          return (
            <DetailSelectModal
              onRowClick={detail => {
                cost.setDetailId(detail.id)
              }}
            />
          )
        }
        return (
          <CostRow
            key={index}
            onDelete={() => detail.autoWriteoff.deleteDetail(cost.detailId)}
            qtyInput={
              <QtyInputWithUnit
                size="sm"
                sx={{ width: '80px' }}
                value={cost.qty}
                setValue={v => {
                  cost.setQty(v)
                }}
              />
            }
          >
            <DetailName
              detail={{
                id: detail.id ?? 0,
                name: detail.name,
                group_id: detail.groupId ?? 0
              }}
              withLink
              withGroupLink
              withParamsButton
            />
          </CostRow>
        )
      })}
    </Base>
  )
)

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
