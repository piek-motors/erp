import { value_with_unit } from 'domains/pdo/shared'
import { Label, P } from 'lib/index'
import type { Column } from 'react-table'
import type { Material } from 'srv/rpc/pdo/materials'

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
		accessor: m => value_with_unit(m.stock, m.unit, { fraction_digits: 0, null_on_zero: true }),
	},
]
