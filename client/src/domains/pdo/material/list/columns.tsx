import { Label, P, Row, Stack } from 'lib/index'
import { roundAndTrim } from 'lib/utils/fmt'
import { Unit, uiUnit } from 'models'
import { Column } from 'react-table'
import { Material } from 'srv/rpc/pdo/materials'

function balanceWithUnit(stock: number, unit: Unit) {
  if (!stock) return ''
  const roundedStock = roundAndTrim(stock, 0)
  if (!roundedStock || roundedStock === '0') return ''
  return (
    <Row gap={0.5}>
      <P>{roundedStock}</P>
      <P level="body-xs">{uiUnit(unit)}</P>
    </Row>
  )
}

export const columns: Column<Material>[] = [
  {
    Header: '№',
    accessor: m => <Label xs>{m.id}</Label>
  },
  {
    Header: 'Наименование',
    id: 'name',
    accessor: m => <P whiteSpace={'nowrap'}>{m.label}</P>,
    width: '95%'
  },
  {
    Header: 'Остаток',
    accessor: m => balanceWithUnit(m.stock, m.unit)
  },
  {
    Header: 'Норм. запас',
    accessor: m => balanceWithUnit(m.safety_stock, m.unit)
  },
  {
    Header: 'Квартал',
    accessor: m => (
      <Row>
        <Stack>
          {m.total_income && m.total_income != 0 && (
            <P fontWeight={400} level="body-xs">
              +{m.total_income}
            </P>
          )}
          {m.total_outcome && m.total_outcome != 0 && (
            <P fontWeight={400} level="body-xs">
              -{m.total_outcome}
            </P>
          )}
        </Stack>
        {(m.total_income || m.total_outcome) && (
          <P fontWeight={400} level="body-xs">
            {uiUnit(m.unit)}
          </P>
        )}
      </Row>
    )
  }
]
