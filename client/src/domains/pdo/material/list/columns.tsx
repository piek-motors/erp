import { Label, P, Row } from 'lib/index'
import { roundAndTrim } from 'lib/utils/formatting'
import { Column } from 'react-table'
import { Material } from 'srv/rpc/pdo/material/list'
import { ShapeNameToIconMap } from './list'

export const columns: Column<Material>[] = [
  {
    Header: '№',
    accessor: m => <Label xs>{m.id}</Label>
  },
  {
    Header: 'Наименование',
    id: 'name',
    accessor: m => {
      const label = <P whiteSpace={'nowrap'}>{m.label}</P>
      if (ShapeNameToIconMap[m.shape]) {
        const iconUrl = ShapeNameToIconMap[m.shape]
        return (
          <Row>
            <img
              src={iconUrl}
              width={16}
              height={16}
              style={{ opacity: 0.65 }}
            />
            {label}
          </Row>
        )
      }
      return label
    },
    width: '95%'
  },
  {
    Header: 'Остаток, м',
    accessor: m => <>{roundAndTrim(m.stock)}</>
  },
  {
    Header: 'Норм. остаток, м',
    accessor: m => <>{roundAndTrim(m.safety_stock)}</>
  }
]
