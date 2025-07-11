import { Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { EnUnit } from 'domain-model'
import { Label, P, Row, SendMutation } from 'lib/index'
import { QtyInputWithUnit } from 'metalflow/shared'
import { observer } from 'mobx-react-lite'

interface MaterialOperationLayoutProps {
  title: string
  materialLabel?: string
  materialUnit: EnUnit
  linearMass: string
  quantityValue: string
  quantitySetValue: (value: string) => void
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
        <PageTitle title={props.title} />
        <Row sx={{ fontSize: 20 }}>
          <Label>Материал: </Label>
          <P fontWeight={600} color="primary">
            {props.materialLabel || <P color="neutral">Не выбран</P>}
          </P>
        </Row>
        <QtyInputWithUnit
          unitId={props.materialUnit}
          value={props.quantityValue}
          setValue={props.quantitySetValue}
          label={'Масса'}
        />
        {props.linearMass != '0' && (
          <QtyInputWithUnit
            unitId={EnUnit.M}
            value={props.lengthValue}
            setValue={props.lengthSetValue}
            label={'Длина'}
          />
        )}
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
