/** @jsxImportSource @emotion/react */
import { Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { InModal } from 'components/modal'
import { observer } from 'lib/deps'
import { Btn, Label, P, Row, SendMutation, useState } from 'lib/index'
import { QtyInputWithUnit } from 'metalflow/shared'
import { WriteoffReasonSelect } from 'metalflow/writeoffs/writeoff.shared'
import { t } from '../../text'
import { material } from '../material.state'

export const MaterialWriteoff = observer(() => {
  const creationForrbidden = material.writeoff.validate() !== undefined
  const error = () => {
    if (creationForrbidden) {
      return (
        <P color="danger" level="body-sm">
          {material.writeoff.validate()?.message}
        </P>
      )
    }
  }
  console.log(material.unit)
  return (
    <Stack gap={1} py={2}>
      <PageTitle title={t.WriteOffAdd} hideIcon />
      <Row sx={{ fontSize: 20 }}>
        <Label>Материал: </Label>
        <P fontWeight={600} color="primary" sx={{ whiteSpace: 'nowrap' }}>
          {material.label}
        </P>
      </Row>
      <QtyInputWithUnit
        label="Вес"
        setValue={v => material.writeoff.setWeight(v)}
        unitId={material.unit}
        value={material.writeoff.weight.toString()}
      />
      <WriteoffReasonSelect
        reason={material.writeoff.reason}
        setReason={v => material.writeoff.setReason(v)}
      />
      <SendMutation
        disabled={creationForrbidden}
        onClick={async () => await material.writeoff.save(material.id)}
      />
      {error()}
    </Stack>
  )
})

export const WriteoffModal = observer(() => {
  const [open, setOpen] = useState(false)
  return (
    <InModal
      openButton={
        <Btn variant="soft" color="danger">
          Списать
        </Btn>
      }
      open={open}
      setOpen={setOpen}
    >
      <MaterialWriteoff />
    </InModal>
  )
})
