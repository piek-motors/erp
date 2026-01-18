import { Box, Card, CardProps, Stack } from '@mui/joy'
import { Btn, observer, P, Row } from 'lib/index'
import { MetalPageTitle } from '../shared'
import { OperationModal } from './modals'
import { modalState } from './modals.store'

interface Props {
  children: React.ReactNode
  stock: number
  unit: string
  supply: React.ReactNode
  writeoff: React.ReactNode
  cardProps?: CardProps
}

export const SupplyCompletedText = 'Поставка зарегистрирована'
export const WriteoffCompletedText = 'Списание зарегистрировано'

export const WarehouseCard = observer((props: Props) => (
  <Card
    variant="soft"
    size="sm"
    color="primary"
    sx={{
      width: 'fit-content',
      gap: 0.5,
      height: 'inherit',
      flexDirection: 'row',
      ...props.cardProps?.sx
    }}
    {...props.cardProps}
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
      openButton={
        <Btn variant="soft" color={'success'} fullWidth size="md">
          Поставка
        </Btn>
      }
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
      openButton={
        <Btn variant="soft" color={'warning'} fullWidth size="md">
          Списание
        </Btn>
      }
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
))
