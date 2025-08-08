import { Stack } from '@mui/joy'
import { QtyInputWithUnit } from 'domains/metalflow/shared'
import { ExecuteAction, Label, P, Row } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { EnUnit } from 'models'

interface Props {
  materialLabel?: string
  lengthValue: string
  lengthSetValue: (value: string) => void
  reasonComponent: React.ReactNode
  submitDisabled: boolean
  onSubmit: () => Promise<unknown>
}

export const CreateWarehouseMaterialOperation = observer((props: Props) => (
  <Stack spacing={1} p={1}>
    <Row sx={{ fontSize: 20 }}>
      <Label>Материал: </Label>
      <P fontWeight={600} color="primary">
        {props.materialLabel || <P color="neutral">Не выбран</P>}
      </P>
    </Row>
    <QtyInputWithUnit
      unitId={EnUnit.M}
      value={props.lengthValue}
      setValue={props.lengthSetValue}
      label={'Длина'}
    />
    {props.reasonComponent}
    <ExecuteAction disabled={props.submitDisabled} onSubmit={props.onSubmit} />
  </Stack>
))
