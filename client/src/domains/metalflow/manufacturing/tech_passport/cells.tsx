import { Step } from 'domains/metalflow/detail/detail.state'
import { Inp } from 'lib/index'
import { observer } from 'mobx-react-lite'

export const DefectCell = observer((props: { step: Step }) => (
  <Inp
    sx={{ width: '60px' }}
    variant="plain"
    value={props.step.defected ?? ''}
    onChange={v => props.step.setDefected(v == '' ? null : Number(v))}
  />
))

export const ExecutorCell = observer((props: { step: Step }) => (
  <Inp
    sx={{ width: '100px' }}
    variant="plain"
    value={props.step.executor_name}
    onChange={v => {
      props.step.setExecutor(v ?? '')
    }}
  />
))

export const DateCell = observer((props: { step: Step }) => (
  <Inp
    sx={{ width: '60px' }}
    variant="plain"
    value={props.step.date}
    onChange={v => {
      props.step.setDate(v ?? '')
    }}
  />
))
