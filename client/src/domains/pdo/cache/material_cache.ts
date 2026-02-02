import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { toNormalForm } from 'lib/utils/search'
import { makeAutoObservable } from 'mobx'
import type { Material } from 'srv/domains/pdo/materials'

export class MaterialCache {
	private materials: Material[] = []
	setMaterials(materials: Material[]) {
		this.materials = materials
	}
	get(id: number): Material | undefined {
		return this.materials.find(material => material.id === id)
	}
	getLabel(id: number): string | null {
		const material = this.get(id)
		return material ? material.label : null
	}
	getMaterials() {
		return this.materials
	}
	/** for searching */
	get normalized_materials() {
		return this.materials.map(m => ({
			...m,
			label: toNormalForm(m.label),
		}))
	}
	removeMaterial(material: Material) {
		this.setMaterials(this.materials.filter(m => m.id !== material.id))
	}
	addMaterial(material: Material) {
		this.setMaterials([...this.materials, material])
	}
	updateMaterial(material: Material) {
		this.setMaterials(
			this.materials.map(m => (m.id === material.id ? material : m)),
		)
	}
	constructor() {
		makeAutoObservable(this)
	}
	async invalidate() {
		const materials = await rpc.pdo.material.list.query()
		const decodedMaterials = matrixDecoder<Material>(materials)
		this.setMaterials(decodedMaterials)
	}
}
