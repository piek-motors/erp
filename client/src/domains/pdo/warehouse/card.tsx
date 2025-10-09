import { Box, Card } from '@mui/joy'
import { P, Row } from 'lib/index'
import { OperationsListModal, SupplyModal, WriteoffModal } from './modals'

interface Props {
  materialId?: number
  detailId?: number
  stock: number
  unit: string
  supplyModal: React.ReactNode
  writeoffModal: React.ReactNode
}

export const WarehouseCard = (props: Props) => {
  return (
    <Card
      variant="plain"
      size="sm"
      sx={{ width: '-webkit-fill-available', gap: 1.2, height: 'inherit' }}
    >
      <Row justifyContent={'center'}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <img
            src="/icons/warehouse.svg"
            width={20}
            height={20}
            style={{ opacity: 0.5 }}
          />
        </Box>
        <P textAlign={'center'}>
          {props.stock.toFixed(0)} {props.unit}
        </P>
      </Row>
      <SupplyModal>{props.supplyModal}</SupplyModal>
      <WriteoffModal>{props.writeoffModal}</WriteoffModal>
      <OperationsListModal
        materialId={props.materialId}
        detailId={props.detailId}
      />
    </Card>
  )
}
