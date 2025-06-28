/** @jsxImportSource @emotion/react */
import { Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { InModal } from 'components/modal'
import { Btn, Label, P, Row, SendMutation, useState } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { QtyInputWithUnit } from '../../shared/qty_input_with_unit'
import { t } from '../../text'
import { material } from '../material.state'

export const MaterialSupplyPage = observer(() => {
  if (!material.material?.id) {
    return <P>Материал не выбран</P>
  }
  return (
    <Stack spacing={1} p={2}>
      <PageTitle title={t.AddSupply} hideIcon />
      <Row sx={{ fontSize: 20 }}>
        <Label>Материал: </Label>
        <P fontWeight={600} color="primary">
          {material.material?.label || <P color="neutral">Не выбран</P>}
        </P>
      </Row>
      <QtyInputWithUnit
        unitId={material.material?.unit}
        value={material.supply.qty}
        setValue={value => material.supply.setQty(value)}
        label={t.Qty}
      />
      <SendMutation
        onClick={() => material.supply.insertSupply(material.material?.id)}
      />
    </Stack>
  )
})

export const SupplyModal = observer(() => {
  const [open, setOpen] = useState(false)
  return (
    <InModal
      openButton={
        <Btn variant="soft" color="success">
          Поставка
        </Btn>
      }
      open={open}
      setOpen={setOpen}
    >
      <MaterialSupplyPage />
    </InModal>
  )
})
