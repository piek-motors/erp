import { AttachmentsStore } from 'components/attachments/store'
import { makeAutoObservable } from 'mobx'
import { Unit } from 'models'
import type { RouterInput, RouterOutput } from 'srv/lib/trpc'
import type { SelectableDetail } from 'srv/rpc/pdo/details'
import { cache } from '../cache/root'
import { DetailAutomaticWriteoffStore } from './warehouse/auto_writeoff.store'
import { DetailWarehouseStore } from './warehouse/store'

type DetailResponse = RouterOutput['pdo']['details']['get']['detail']
type UpdateDetailRequest = RouterInput['pdo']['details']['update']

export class Operation {
	id: number | null
	setId(id: number | null) {
		this.id = id
	}
	constructor(id: number | null) {
		makeAutoObservable(this)
		this.id = id
	}
	get name(): string {
		if (!this.id) return ''
		const name = cache.details.dictProcessingOperaions.find(
			each => each.id === this.id,
		)?.v
		return name ?? 'No value in the dict'
	}
}

class ProcessingRoute {
	steps: Operation[] = []
	init(steps: Operation[]) {
		this.steps = steps
	}
	constructor() {
		makeAutoObservable(this)
	}
	addEmpty() {
		this.steps = [...this.steps, new Operation(null)]
	}
	remove(idx: number) {
		if (idx < 0 || idx >= this.steps.length) return
		this.steps = [...this.steps.slice(0, idx), ...this.steps.slice(idx + 1)]
	}
	reset() {
		this.steps = []
	}
}

export type BlankSpec = {
	arr: { key: string; value: any }[]
}

export type DetailStProp = { detail: DetailSt }

export class DetailSt {
	readonly attachments = new AttachmentsStore()
	readonly warehouse = new DetailWarehouseStore()
	readonly autoWriteoff = new DetailAutomaticWriteoffStore()
	readonly processingRoute = new ProcessingRoute()

	static fromDto(detail: Partial<SelectableDetail>): DetailSt {
		return new DetailSt().init({
			id: detail.id ?? 0,
			name: detail.name ?? '',
			part_code: detail.part_code ?? null,
			logical_group_id: detail.logical_group_id ?? null,
			stock: detail.stock || 0,
			description: detail.description || '',
			drawing_name: detail.drawing_name ?? '',
			updated_at: detail.updated_at?.toString() ?? '',
			blank_spec: detail.blank_spec,
			recommended_batch_size: detail.recommended_batch_size ?? null,
			processing_route: detail.processing_route ?? null,
			automatic_writeoff: detail.automatic_writeoff ?? null,
			unit: detail.unit ?? Unit.Countable,
			stock_location: detail.stock_location ?? null,
		})
	}

	id: number = 0
	setId(id: number) {
		this.id = id
	}
	name: string = ''
	setName(name: string) {
		this.name = name
	}
	description?: string
	setDescription(description?: string | null) {
		this.description = description ?? ''
	}
	groupId?: number | null
	setGroupId(groupId: number | null) {
		this.groupId = groupId
	}
	drawingName?: string
	setDrawingName(name: string) {
		this.drawingName = name
	}
	drawingNumber?: string
	setDrawingNumber(drawingNumber: string) {
		this.drawingNumber = drawingNumber
	}
	stockLocation?: string | null
	setStockLocation(v: string) {
		this.stockLocation = v
	}
	blankSpec?: BlankSpec | null = null
	setBlankSpec(params?: BlankSpec | null) {
		this.blankSpec = params
	}
	updatedAt?: Date
	setUpdatedAt(date: Date | undefined) {
		this.updatedAt = date
	}
	lastManufacturingDate?: Date
	setLastManufacturingDate(date: Date | undefined) {
		this.lastManufacturingDate = date
	}
	lastManufacturingQty?: number
	setLastManufacturingQty(qty: number | undefined) {
		this.lastManufacturingQty = qty
	}
	recentlyAdded?: number
	setRecentlyAdded(id: number) {
		this.recentlyAdded = id
	}
	recentlyUpdated?: number
	setRecentlyUpdated(id: number) {
		this.recentlyUpdated = id
	}
	recommendedBatchSize?: number
	setRecommendedBatchSize(size?: number) {
		this.recommendedBatchSize = size
	}

	constructor() {
		makeAutoObservable(this)
	}

	init(d: DetailResponse) {
		this.setId(d.id!)
		this.setName(d.name!)
		this.setDrawingNumber(d.part_code!)
		this.setGroupId(d.logical_group_id)
		this.setBlankSpec(d.blank_spec)
		this.setDescription(d.description)
		this.warehouse.setStock(d.stock)
		this.setUpdatedAt(d.updated_at ? new Date(d.updated_at) : undefined)
		this.processingRoute.init(
			d.processing_route && d.processing_route.steps
				? d.processing_route.steps.map(
						operation_id => new Operation(operation_id),
					)
				: [],
		)
		this.setDrawingName(d.drawing_name ?? '')
		if (d.automatic_writeoff) {
			this.autoWriteoff.init(d.automatic_writeoff)
		}
		this.setRecommendedBatchSize(d.recommended_batch_size ?? undefined)
		this.stockLocation = d.stock_location
		return this
	}

	reset() {
		this.id = 0
		this.name = ''
		this.description = ''
		this.recentlyAdded = undefined
		this.recentlyUpdated = undefined
		this.groupId = undefined
		this.drawingNumber = ''
		this.blankSpec = null
		this.updatedAt = undefined
		this.lastManufacturingDate = undefined
		this.lastManufacturingQty = undefined
		this.drawingName = ''
		this.processingRoute.reset()
		this.autoWriteoff.reset()
	}

	payload(): UpdateDetailRequest {
		return {
			id: this.id ?? 0,
			description: this.description ?? '',
			name: this.name ?? '',
			partCode: this.drawingNumber ?? null,
			groupId: this.groupId ?? null,
			blankSpec: {
				arr:
					this.blankSpec?.arr
						?.map(({ key, value }) => ({
							key: key?.trim(),
							value: value?.trim(),
						}))
						.filter(({ key, value }) => key) ?? [],
			},
			recommendedBatchSize: Number(this.recommendedBatchSize) ?? null,
			processingRoute: this.processingRoute
				? {
						steps: this.processingRoute.steps.map(s => s.id!) ?? null,
					}
				: null,
			drawingName: this.drawingName ?? null,
			automaticWriteoff: this.autoWriteoff.payload,
			stockLocation: this.stockLocation || null,
		}
	}
}
