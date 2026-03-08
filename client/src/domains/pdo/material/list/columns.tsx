import type { Column } from 'react-table'
import { AdaptiveNumberFormatter } from '@/domains/pdo/shared/adaptive_number_formatter'
import { Indicator, value_with_unit } from '@/domains/pdo/shared/basic'
import { Label, Row } from '@/lib/index'
import type { AppMaterial } from '../../cache/material_cache'
import { MaterialName } from '../name'

const formatter = new AdaptiveNumberFormatter(0, 0, true)

export const columns: Column<AppMaterial>[] = [
  {
    Header: '№',
    accessor: m => <Label xs>{m.id}</Label>,
  },
  {
    Header: 'Наим.',
    id: 'name',
    accessor: m => (
      <Row noWrap>
        <MaterialName {...m} disableLink />
        {m.deficit.deficit && (
          <Indicator title="Дефицит" color="rgba(255, 7, 7, 0.8)" />
        )}
      </Row>
    ),
  },
  {
    Header: 'Остаток',
    accessor: m => value_with_unit(formatter.format(m.on_hand_balance), m.unit),
  },
]
