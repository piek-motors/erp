import { Box, Card } from '@mui/joy'
import { Label } from 'lib/index'
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
      sx={{ width: 'fit-content', gap: 1.2, height: 'fit-content' }}
    >
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
      <Label>
        Остаток: {props.stock} {props.unit}
      </Label>
      <SupplyModal>{props.supplyModal}</SupplyModal>
      <WriteoffModal>{props.writeoffModal}</WriteoffModal>
      <OperationsListModal
        materialId={props.materialId}
        detailId={props.detailId}
      />
    </Card>
  )
}
