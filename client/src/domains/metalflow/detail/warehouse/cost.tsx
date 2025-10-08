import { UilLink, UilMinus } from '@iconscout/react-unicons'
import { Divider, IconButton, Stack } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ExtraSmallIconButton } from 'components/buttons'
import { cache } from 'domains/metalflow/cache/root'
import { QtyInputWithUnit } from 'domains/metalflow/shared'
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
import { EnUnit } from 'models'
import { api } from '../api'
import { MaterialSelect } from '../components'
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

export const MaterialCostInputs = observer(() => {
  const materialCost = api.detail.autoWriteoff.materialCost
  return (
    <Base
      label="Расход материала"
      handleAdd={() => {
        api.detail.autoWriteoff.insertMaterialCost()
      }}
      hideAddButton={!!materialCost}
    >
      {materialCost && (
        <CostRow
          key={materialCost.materialId}
          onDelete={() => api.detail.autoWriteoff.setMaterialCost(null)}
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
          <Row>
            <MaterialSelect
              value={materialCost}
              index={0}
              onChange={cost => {
                api.detail.autoWriteoff.updateMaterial(
                  cost.materialId,
                  cost.length
                )
              }}
            />
            <ExtraSmallIconButton
              link={openPage(
                routeMap.metalflow.material.edit,
                materialCost.materialId
              )}
              icon={UilLink}
            />
          </Row>
        </CostRow>
      )}
    </Base>
  )
})

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
    {api.detail.autoWriteoff.detailsCost.map((cost, index) => {
      const detail = cache.details.get(cost.detailId)
      if (!detail) {
        return (
          <DetailSelectModal
            onRowClick={detail => {
              cost.setDetailId(detail.id!)
            }}
          />
        )
      }
      return (
        <CostRow
          key={index}
          onDelete={() => api.detail.autoWriteoff.deleteDetail(cost.detailId)}
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
