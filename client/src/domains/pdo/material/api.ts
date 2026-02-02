import { rpc } from 'lib/deps'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable, runInAction } from 'mobx'
import type { RouterInput } from 'srv/lib/trpc'
import { app_cache } from '../cache'
import { map } from '../mappers'
import { MaterialState } from './state'

export class MaterialApi {
	readonly loader = new LoadingController()
	constructor() {
		makeAutoObservable(this)
	}

	async load(id: number) {
		return this.loader.run(async () => {
			const [res, details] = await Promise.all([
				rpc.pdo.material.get.query({ id }),
				api.get_details_made_from_material(id),
			])
			const { material, writeoff_stat, detailCount } = res
			const m = new MaterialState()

			runInAction(() => {
				m.syncState(map.material.from_dto(material))
				m.id = material.id
				m.label = material.label
				m.alloy = material.alloy || ''
				m.unit = material.unit
				m.detailCount = Number(detailCount)
				m.details_made_from_this_material = details
				m.writeoff_stat = {
					monthly: writeoff_stat.monthly,
					quarterly: writeoff_stat.quarterly,
				}
				m.shortage_prediction_horizon_days =
					material.shortage_prediction_horizon_days
				m.warehouse.on_hand_balance = material.on_hand_balance
			})
			return m
		})
	}

	async insert(m: MaterialState) {
		const payload = this.create_payload(m)
		const res = await rpc.pdo.material.create.mutate(payload)
		m = new MaterialState()
		await app_cache.materials.invalidate()
		return res.id
	}

	async update(m: MaterialState) {
		if (!m.id) throw new Error('Material id is not set')
		const payload = this.create_payload(m)
		return rpc.pdo.material.update
			.mutate({
				...payload,
				id: m.id,
			})
			.then(async res => {
				if (!m.id) throw new Error('Material id is not set')
				const updated = await this.load(m.id)
				app_cache.materials.invalidate()
				return updated
			})
	}

	private create_payload(
		m: MaterialState,
	): RouterInput['pdo']['material']['create'] {
		if (m.unit == null) throw new Error('Не выбрана единица учета остатков')
		return {
			shape: m.shape,
			shape_data: m.get_shape_state(m.shape).export(),
			unit: m.unit,
			alloy: m.alloy || null,
			shortage_prediction_horizon_days: m.shortage_prediction_horizon_days,
		}
	}

	async delete(id: number) {
		await rpc.pdo.material.delete.mutate({ id })
		const materialToRemove = app_cache.materials
			.getMaterials()
			.find(m => m.id === id)
		if (materialToRemove) {
			app_cache.materials.removeMaterial(materialToRemove)
		}
	}

	async get_details_made_from_material(material_id: number) {
		const res = await rpc.pdo.details.filter_by_material.query({
			material_id,
		})
		return res.map(e => ({
			id: e.id,
			name: e.name,
			group_id: e.logical_group_id,
		}))
	}
}

export const api = new MaterialApi()
