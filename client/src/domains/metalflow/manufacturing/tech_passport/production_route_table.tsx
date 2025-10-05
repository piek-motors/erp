/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Operation } from 'domains/metalflow/detail/detail.state'
import { observer } from 'mobx-react-lite'
import { CellInput, tableStyles } from './shared'

type Props = {
  data: Operation[]
}

const qtyInpW = 50
const signW = 100
const dateW = 80

export const DetailProductionRouteTable = observer((props: Props) => {
  return (
    <table css={css(tableStyles)}>
      <thead>
        <tr>
          <th rowSpan={2}>№ п/п</th>
          <th rowSpan={2}>№ опер</th>
          <th rowSpan={2}>Наименование операции</th>
          <th colSpan={6}>Исполнитель</th>
          <th colSpan={3}>Приемка ОТК</th>
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
        {props.data.map((step, i) => (
          <tr key={i}>
            <td width={'1%'}>{i + 1}</td>
            <td width={'1%'}>{i + 1}</td>
            <td width={'1%'}>{step.name}</td>
            <td width={150}>
              <CellInput
                value={step.executor_name}
                onChange={v => step.setExecutor(v ?? '')}
              />
            </td>
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
  )
})
