/** @jsxImportSource @emotion/react */
import { ScrollableWindow, Search } from 'components/inputs'
import { Select } from 'components/select'
import { Table } from 'components/table.impl'
import { MobileNavModal, MobilePadding } from 'domains/pdo/root_layout'
import {
	Button,
	observer,
	Row,
	Stack,
	ToggleButtonGroup,
	useNavigate,
} from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { UiMaterialShape } from 'models'
import type { Material } from 'srv/rpc/pdo/materials'
import { columns } from './columns'
import { MaterialFilterCriteria, materialListStore } from './store'

interface MaterialsTableProps {
	onRowClick?: (material: Material) => void
}

const MaterialList = observer((props: MaterialsTableProps) => {
	const navigate = useNavigate()
	return (
		<Table
			columns={columns}
			data={materialListStore.searchResult}
			onRowClick={row => {
				if (props.onRowClick) {
					props.onRowClick(row)
					return
				} else {
					if (!row.id) throw Error('Material id is null')
					navigate(openPage(routeMap.pdo.material.edit, row.id))
				}
			}}
		/>
	)
})

export const MaterialListPage = observer((props: MaterialsTableProps) => (
	<ScrollableWindow
		static={
			<MobilePadding>
				<Stack gap={0.5}>
					<MobileNavModal t={'Материалы'} />
					<ShapeFilter />
					<Row px={1}>
						<Search
							variant="outlined"
							placeholder={materialListStore.filter_criteria}
							value={materialListStore.search_query}
							onChange={v => {
								materialListStore.set_search_query(v.target.value)
							}}
						>
							<Select
								width="min-content"
								size="sm"
								value={materialListStore.filter_criteria}
								onChange={e => materialListStore.set_filter_criteria(e)}
								selectElements={Object.values(MaterialFilterCriteria).map(
									v => ({
										name: v,
										value: v,
									}),
								)}
							/>
						</Search>
					</Row>
				</Stack>
			</MobilePadding>
		}
		scroll={<MaterialList {...props} />}
	/>
))

const ShapeFilter = observer(() => {
	const shapes = Object.entries(UiMaterialShape)
	const value = materialListStore.shape_filter?.toString()
	return (
		<ToggleButtonGroup
			size="sm"
			variant="soft"
			color="primary"
			value={value}
			sx={{ overflow: 'scroll' }}
			onChange={(_, value) => {
				if (value == null) {
					materialListStore.set_shape_filter()
				} else {
					materialListStore.set_shape_filter(Number(value))
				}
			}}
		>
			{shapes.map(([index, name]) => (
				<Button key={index} value={index}>
					{name}
				</Button>
			))}
		</ToggleButtonGroup>
	)
})
