/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/joy'
import { DetailName } from 'domains/metalflow/detail/name'
import { Label, observer, P, Row } from 'lib/index'
import { ReactNode } from 'react'
import { OrderState } from '../order.state'
import { tableStyles } from './shared'
type Props = {
  order: OrderState
}

const square = <Box width={30} height={30} />

const L = (props: { children: ReactNode }) => (
  <Label level={'body-xs'}>{props.children}</Label>
)

export const DetailTechPassportTable = observer((props: Props) => {
  const s = props.order
  const materialCost = s.detail.autoWriteoff.materialsCost.find(e => e)
  const blankLength = s.detail.technicalParameters?.arr.find(
    p => p.key.trim() === 'L'
  )?.value

  if (!s.order) return
  return (
    <table css={css(tableStyles)} style={{ textAlign: 'center' }}>
      <tbody>
        <tr>
          <td>ООО ПЭК</td>
          <td colSpan={9}>Технологический паспорт № </td>
          <td>ОП</td>
          <td>Взрыв</td>
          <td>
            <L>Дата запуска в производство</L>
            <Box width={50} height={30}></Box>
          </td>
        </tr>
        <tr>
          <td colSpan={3}>
            <L>Обозначение детали</L>
            <Box>{s.detail.drawingNumber}</Box>
          </td>
          <td colSpan={3}>
            <L>Наименование детали</L>
            <Row justifyContent={'center'}>
              <DetailName
                withLink
                withParamsButton
                detail={{
                  id: s.order.detail_id,
                  name: s.order.detail_name,
                  group_id: s.order.group_id || null
                }}
              />
            </Row>
            {materialCost && (
              <Box>
                Заготовка {materialCost.material?.label} -{' '}
                {blankLength && <b>{blankLength} мм</b>}
              </Box>
            )}
          </td>
          <td width={70}>Заказ № {square}</td>
          <td width={70}>
            Кол. дет. в партии <P>{s.order?.qty || ''}</P>
          </td>

          <td colSpan={6} style={{ padding: 0 }}>
            <L>Поступление на склад</L>
            <table css={css(tableStyles)} style={{ border: 'none' }}>
              <tbody>
                <tr>
                  <td>
                    <L>Дата</L> {square}
                  </td>
                  <td width={'20%'}>
                    <L>Кол.</L> {square}
                  </td>
                  <td>
                    <L>Принял</L> {square}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {s.detail.description && (
          <tr>
            <td colSpan={13}>
              <L>Примечание</L>
              <Box>{s.detail.description}</Box>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
})
