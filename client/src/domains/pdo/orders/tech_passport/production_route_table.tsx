/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { Stack } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import type { DetailStProp } from '@/domains/pdo/detail/detail.state'
import { Label } from '@/lib/index'
import { SingleWorkflowTask, type WorkflowTask } from '../../detail/workflow'
import { tableStyles } from './shared'

type Props = {
  operations: WorkflowTask[]
}

const qtyInpW = 50
const signW = 50
const dateW = 80

export const ProductionRoute = observer(({ detail }: DetailStProp) => {
  const steps = detail.workflow.tasks
  if (steps.length === 0) return null
  return (
    <Stack>
      <Label label="Маршрут" level="body-xs" />
      <DetailProductionRouteTable operations={steps} />
    </Stack>
  )
})

const DetailProductionRouteTable = observer((props: Props) => (
  <table css={css(tableStyles)}>
    <thead>
      <tr>
        <th rowSpan={2}>Наим. операции</th>
        <th colSpan={4}>Исполнитель</th>
        <th colSpan={6}>Приемка ОТК</th>
      </tr>
      <tr>
        <th>Ф.И.О</th>
        <th>Кол. дет.</th>
        <th>Дата</th>
        <th>Подпись</th>
        <th>Кол. провер. деталей</th>
        <th>Кол. отбраков. деталей</th>
        <th>Штамп, подпись</th>
        <th>Дата</th>
        <th>Примечание</th>
      </tr>
    </thead>
    <tbody>
      {props.operations.map((workflow_task, i) => (
        <tr
          key={i}
          css={css({
            td: {
              padding: '10px 5px',
            },
          })}
        >
          <td width={'1%'}>
            <SingleWorkflowTask task={workflow_task} idx={i} />
          </td>
          <td width={150} />
          <td width={qtyInpW} />
          <td width={dateW} />
          <td width={signW} />
          <td width={qtyInpW} />
          <td width={qtyInpW} />
          <td width={signW} />
          <td width={dateW} />
          <td width={'20%'} />
        </tr>
      ))}
    </tbody>
  </table>
))
