import { Stack } from '@mui/joy'
import { EnUnit } from 'domain-model'
import { Label, P, Row, SendMutation } from 'lib/index'
import { QtyInputWithUnit } from 'metalflow/shared'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { observer } from 'mobx-react-lite'

interface MaterialOperationLayoutProps {
  title: string
  materialLabel?: string
  materialUnit: EnUnit
  lengthValue: string
  lengthSetValue: (value: string) => void
  reasonComponent: React.ReactNode
  submitDisabled: boolean
  onSubmit: () => Promise<unknown>
  error?: React.ReactNode
}

export const MaterialOperationLayout = observer(
  (props: MaterialOperationLayoutProps) => {
    return (
      <Stack spacing={1} p={1}>
        <MetalPageTitle t={props.title} />
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
        <SendMutation
          disabled={props.submitDisabled}
          onClick={props.onSubmit}
        />
        {props.error}
      </Stack>
    )
  }
)
