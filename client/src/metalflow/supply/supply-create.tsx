/** @jsxImportSource @emotion/react */
import { Button, Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { FullscreenDialog } from 'components/fullscreen.dialog'
import { P, Row, SendMutation } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { MaterialsListPage } from '../material/material_list'
import { QtyInputWithUnit } from '../shared'
import { t } from '../text'
import { supplyStore } from './supply.store'

export const AddSupplyPage = observer(() => {
  return (
    <Stack spacing={2}>
      <Stack gap={2} py={2}>
        <PageTitle subTitle={t.AddSupply} hideIcon />
        <Row sx={{ fontSize: 20 }}>
          <P color="primary">Материал: </P>
          <P fontWeight={600} color="primary">
            {supplyStore.material?.label || <P color="neutral">Не выбран</P>}
          </P>
        </Row>
        <FullscreenDialog
          open={supplyStore.selectMaterialDialogOpen}
          setOpen={v => supplyStore.setSelectMaterialDialogOpen(v)}
          openButton={
            <Button variant="soft" color="neutral">
              Выбрать материал
            </Button>
          }
        >
          <MaterialsListPage
            onRowClick={m => {
              supplyStore.setMaterial(m)
              supplyStore.setSelectMaterialDialogOpen(false)
            }}
            highlight={m => m.id == supplyStore.material?.id}
            highlightColor="#97c3f098"
          />
        </FullscreenDialog>
        <QtyInputWithUnit
          unitId={supplyStore.material?.unit}
          value={supplyStore.qty}
          setValue={value => supplyStore.setQty(value)}
          label={t.Qty}
        />
        <SendMutation onClick={() => supplyStore.insertSupply()} />
      </Stack>
    </Stack>
  )
})
