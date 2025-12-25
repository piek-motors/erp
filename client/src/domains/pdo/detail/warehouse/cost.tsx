import { UilMinus } from '@iconscout/react-unicons'
import { IconButton, Stack } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { NumberInput } from 'components/inputs/number_input'
import { cache } from 'domains/pdo/cache/root'
import {
  Box,
  Label,
  observer,
  P,
  PlusIcon,
  Row,
  Sheet,
  UseIcon
} from 'lib/index'
import { uiUnit, Unit } from 'models'
import { MaterialSelect } from '../components'
import { DetailSt } from '../detail.state'
import { DetailSelectModal } from '../list/list'
import { DetailName } from '../name'

interface CostRowProps {
  children: React.ReactNode
  onDelete: () => void
  qtyInput: React.ReactNode
}

const CostRow = ({ children, onDelete, qtyInput: input }: CostRowProps) => (
  <Stack gap={0.5}>
    <Row gap={0.5}>{children}</Row>
    <Row justifyContent={'space-between'}>
      {input}
      <IconButton variant="soft" color="danger" size="sm" onClick={onDelete}>
        <UseIcon icon={UilMinus} />
      </IconButton>
    </Row>
  </Stack>
)

export const MaterialCostInputs = observer(
  ({ detail }: { detail: DetailSt }) => {
    const materialCost = detail.autoWriteoff.materialCost
    const material = cache.materials.get(materialCost?.materialId || 0)

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
              <Stack>
                <Row>
                  <NumberInput
                    width={100}
                    size="sm"
                    unit={uiUnit(material?.unit)}
                    value={materialCost.length}
                    onChange={v => {
                      materialCost.setLength(v)
                    }}
                  />
                  {material?.unit === Unit.M && materialCost.length && (
                    <P color="neutral" level="body-xs">
                      {materialCost.length * 1000} мм
                    </P>
                  )}
                </Row>
              </Stack>
            }
          >
            <MaterialSelect
              value={materialCost}
              index={0}
              onChange={cost => {
                detail.autoWriteoff.updateMaterial(
                  cost.materialId,
                  cost.length!
                )
              }}
            />
          </CostRow>
        )}
      </Base>
    )
  }
)

export const AutomaticWriteoffAccordion = observer(
  ({ detail }: { detail: DetailSt }) => (
    <AccordionCard title="Расход" defaultExpanded width={'fit-content'}>
      <Stack>
        <Label color="neutral" sx={{ mb: 1 }} level="body-xs">
          <b>Автоматическое списание</b> материалов при запуске в производство.
          {/* <br /> Выберите <b>либо расход материала</b>,{' '} */}
          {/* <b>либо расход иных деталей</b>. */}
        </Label>
        <MaterialCostInputs detail={detail} />
        {/* <Divider sx={{ my: 0.5 }} /> */}
        {/* <DetailCostInputs detail={detail} /> */}
      </Stack>
    </AccordionCard>
  )
)

export const DetailCostInputs = observer(({ detail }: { detail: DetailSt }) => (
  <Base
    label="Расход деталей"
    handleAdd={() => detail.autoWriteoff.insertDetail()}
  >
    {detail.autoWriteoff.detailsCost.map((cost, index) => {
      const detailCache = cache.details.get(cost.detailId)
      if (!detailCache) {
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
          onDelete={() => {
            detail.autoWriteoff.deleteDetail(cost.detailId)
          }}
          qtyInput={
            <NumberInput
              value={cost.qty}
              onChange={v => {
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
            withGroupName
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
