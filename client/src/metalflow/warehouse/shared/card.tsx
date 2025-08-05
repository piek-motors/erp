import { Card } from '@mui/joy'
import { P } from 'lib/index'
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
    <Card variant="outlined" size="sm" sx={{ width: 'fit-content', gap: 1.2 }}>
      <P>
        Остаток: {props.stock} {props.unit}
      </P>
      <SupplyModal>{props.supplyModal}</SupplyModal>
      <WriteoffModal>{props.writeoffModal}</WriteoffModal>
      <OperationsListModal
        materialId={props.materialId}
        detailId={props.detailId}
      />
    </Card>
  )
}
