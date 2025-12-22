import { Box, Card, Stack } from '@mui/joy'
import { observer, P, Row } from 'lib/index'
import { MetalPageTitle } from '../shared'
import { OperationModal } from './modals'
import { modalState } from './modals.store'

interface Props {
  children: React.ReactNode
  stock: number
  unit: string
  supply: React.ReactNode
  writeoff: React.ReactNode
}

export const SupplyCompletedText = 'Поставка зарегистрирована'
export const WriteoffCompletedText = 'Списание зарегистрировано'

export const WarehouseCard = observer((props: Props) => {
  return (
    <Card
      variant="soft"
      size="sm"
      color="primary"
      sx={{ width: 'fit-content', gap: 0.5, height: 'inherit' }}
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
      <OperationModal
        btn={{ label: 'Поставка', color: 'success' }}
        open={modalState.supply}
        setOpen={o => {
          modalState.setSupply(o)
        }}
      >
        <MetalPageTitle t="Поставка" />
        <Stack gap={1} my={1}>
          {props.supply}
        </Stack>
      </OperationModal>

      <OperationModal
        btn={{ label: 'Списание', color: 'warning' }}
        open={modalState.writeoff}
        setOpen={o => modalState.setWriteoff(o)}
      >
        <MetalPageTitle t="Списание" />
        <Stack gap={1} my={1}>
          {props.writeoff}
        </Stack>
      </OperationModal>
      {props.children}
    </Card>
  )
})
