import { AdaptiveNumberFormatter, value_with_unit } from 'domains/pdo/shared'
import { Label, P } from 'lib/index'
import type { Column } from 'react-table'
import type { Material } from 'srv/rpc/pdo/materials'

const formatter = new AdaptiveNumberFormatter(0, 0, true)

export const columns: Column<Material>[] = [
	{
		Header: '№',
		accessor: m => <Label xs>{m.id}</Label>,
	},
	{
		Header: 'Наим.',
		id: 'name',
		accessor: m => <P>{m.label}</P>,
	},
	{
		Header: 'Остаток',
		accessor: m => value_with_unit(formatter.format(m.stock), m.unit),
	},
]
