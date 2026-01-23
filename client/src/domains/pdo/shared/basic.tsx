import { Button, Stack, ToggleButtonGroup } from '@mui/joy'
import type { SxProps } from '@mui/joy/styles/types'
import { BaseAutocomplete, type BaseOption } from 'components/base-autocomplete'
import { DeleteConfirmDialog } from 'components/delete_confirm_dialog'
import { NavTopBar, type Props as PageTitleProps } from 'components/nav_topbar'
import { ActionButton, DeleteResourceButton, Label, P, Row } from 'lib/index'
import { rpc } from 'lib/rpc/rpc.client'
import { UiUnit, Unit, uiUnit } from 'models'
import { useEffect, useState } from 'react'
import { MobileNavModal } from '../root_layout'

export function MaterialUnitSelect(props: {
	value?: Unit
	onChange: (e: Unit) => void
	disabled?: boolean
}) {
	return (
		<Stack>
			<Label label="Ед. учета остатков" />
			<ToggleButtonGroup
				disabled={props.disabled}
				variant="outlined"
				color="primary"
				value={props.value != null ? Object.keys(Unit)[props.value] : null}
				onChange={(e, v) => {
					props.onChange(parseInt(v as any))
				}}
			>
				{Object.entries(UiUnit).map(([key, value]) => (
					<Button value={key} key={key}>
						{value}
					</Button>
				))}
			</ToggleButtonGroup>
		</Stack>
	)
}

export function AlloyAutocomplete(props: {
	setAlloy: (alloy: string) => void
	alloy?: string
}) {
	const { setAlloy, alloy } = props
	const [alloys, setAlloys] = useState<string[]>([])
	useEffect(() => {
		rpc.pdo.material.dict_distinct_alloys
			.query()
			.then(alloys => setAlloys(alloys.filter(Boolean) as string[]))
	}, [])

	const options: BaseOption[] =
		alloys.filter(Boolean).map(alloy => ({
			label: alloy,
			value: alloy,
		})) || []

	return (
		<>
			<BaseAutocomplete
				label={'Сплав'}
				options={options}
				value={alloy ? { label: alloy, value: alloy } : null}
				onChange={newValue => {
					if (newValue && !Array.isArray(newValue)) {
						setAlloy(newValue.value)
					} else {
						setAlloy('')
					}
				}}
				freeSolo
				loading={alloys.length === 0}
			/>
		</>
	)
}

export const SaveAndDelete = (props: {
	itemName: string
	handleDelete: () => Promise<unknown>
	handleSave: () => Promise<unknown>
	sx?: SxProps
}) => {
	return (
		<Row alignItems={'end'} gap={2} sx={props.sx}>
			<ActionButton
				fullWidth
				onClick={() => props.handleSave()}
				props={{
					size: 'sm',
				}}
			/>
			<DeleteConfirmDialog
				title={props.itemName}
				handleDelete={() => props.handleDelete()}
				button={<DeleteResourceButton />}
			/>
		</Row>
	)
}

export const MetalPageTitle = (props: PageTitleProps) => (
	<NavTopBar
		{...props}
		mobileMenuButton={<MobileNavModal />}
		hideIcon
		spaceBetween
	/>
)

export function capitalize(text: string) {
	if (!text) return ''
	return text[0].toUpperCase() + text.slice(1)
}

export const value_with_unit = (value: string | number | null, unit?: Unit) =>
	Boolean(value) && (
		<Row gap={0.5} flexWrap="nowrap">
			<P>{value}</P>
			{unit != null && <P level="body-xs">{uiUnit(unit)}</P>}
		</Row>
	)

export class AdaptiveNumberFormatter {
	constructor(
		/** Initial fraction digits to try */
		readonly fraction_digits: number = 2,
		/** Maximum fraction digits allowed */
		readonly max_fraction_digits: number = 5,
		/** Return null if value resolves to zero */
		readonly null_on_zero: boolean = false,
	) {}

	/**
	 * Public entry point.
	 * Returns a formatted string or null.
	 */
	format(value: number | string): string | null {
		const rounded = this.findNonZeroRoundedValue(Number(value))

		if (this.null_on_zero && this.isZero(rounded)) {
			return null
		}

		return this.trimTrailingZeros(rounded)
	}
	/**
	 * Increases fraction digits until rounding no longer results in zero,
	 * or until maxFractionDigits is reached.
	 */
	private findNonZeroRoundedValue(value: number): string {
		let digits = this.fraction_digits
		let rounded = '0'

		while (digits <= this.max_fraction_digits) {
			rounded = this.round(value, digits)

			if (!this.isZero(rounded)) {
				break
			}

			digits++
		}

		return rounded
	}
	/** Rounds a number using fixed fraction digits */
	private round(value: number, digits: number): string {
		return Number(value).toFixed(digits)
	}
	/**  Checks whether a formatted numeric string equals zero */
	private isZero(value: string): boolean {
		return Number(value) === 0
	}
	/** Removes trailing zeros and dangling decimal point */
	private trimTrailingZeros(value: string): string {
		return value.replace(/\.?0+$/, '')
	}
}
