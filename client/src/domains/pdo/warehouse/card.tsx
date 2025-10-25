import { Box, Card, Stack } from '@mui/joy'
import { P, Row } from 'lib/index'
import { MetalPageTitle } from '../shared'
import { OperationModal, OperationsListModal } from './modals'

interface Props {
  materialId?: number
  detailId?: number
  stock: number
  unit: string
  supplyModal: React.ReactNode
  writeoffModal: React.ReactNode
}

export const WarehouseCard = (props: Props) => (
  <Card
    variant="outlined"
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
    <OperationModal buttonLabel="Поставка" buttonColor="success">
      <MetalPageTitle t="Поставка" />
      <Stack gap={1} my={1}>
        {props.supplyModal}
      </Stack>
    </OperationModal>

    <OperationModal buttonLabel="Списание" buttonColor="danger">
      <MetalPageTitle t="Списание" />
      <Stack gap={1} my={1}>
        {props.writeoffModal}
      </Stack>
    </OperationModal>
    <OperationsListModal
      materialId={props.materialId}
      detailId={props.detailId}
    />
  </Card>
)
