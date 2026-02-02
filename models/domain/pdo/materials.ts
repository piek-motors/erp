import { MaterialShape, Unit } from './enums'
import { uiMaterialShape, uiUnit } from './ui.translators'

export abstract class Material {
	readonly id: number
	label: string
	on_hand_balance: number = 0
	/**
	 * Linear mass in kilograms per meter (kg/m).
	 * Represents the weight of one meter of the material.
	 * Used for quick mass calculations without volume computation.
	 */
	linearMass: number = 0
	/**
	 * Material grade or alloy type (e.g., "медь", "алюминий").
	 * Used for material identification and properties lookup.
	 */
	alloy: string = ''
	abstract readonly unit: Unit
	abstract readonly shape: MaterialShape
	constructor(id: number, label: string = '', alloy?: string | null) {
		this.id = id
		this.label = label
		this.alloy = alloy || ''
	}
	get unitUI() {
		return uiUnit(this.unit)
	}
	get shapeUI() {
		return uiMaterialShape(this.shape)
	}
	abstract deriveLabel(): string
}

export class RoundBar extends Material {
	unit = Unit.M
	shape = MaterialShape.RoundBar
	/**
	 * Diameter of the round bar in millimeters (mm).
	 * This is the primary dimension used for identification and calculations.
	 */
	diameter!: number
	/**
	 * Indicates if the material has undergone calibration process.
	 * Calibration is an additional machining process that improves:
	 * - Surface quality
	 * - Dimensional accuracy
	 * - Geometric parameters
	 */
	calibrated!: boolean
	/**
	 * Material density in kilograms per cubic meter (kg/m³).
	 * Used for mass calculations and material identification.
	 */
	density!: number
	deriveLabel(): string {
		if (Number.isNaN(this.diameter)) {
			throw new Error('RoundBar validation failed: diameter is NaN')
		}
		const calibrationSuffix = this.calibrated ? 'К' : ''
		return `${this.shapeUI} ${this.diameter} ${this.alloy} ${calibrationSuffix}`.trim()
	}
}

export class List extends Material {
	unit = Unit.M
	shape = MaterialShape.List
	/**
	 * Thickness of the sheet in millimeters (mm).
	 * This is the primary dimension used for identification and calculations.
	 */
	thickness!: number
	/**
	 * Width of the sheet in millimeters (mm).
	 * Optional dimension that can be used for specific sheet sizes.
	 */
	width?: number
	deriveLabel(): string {
		if (Number.isNaN(this.thickness) || this.thickness == null) {
			throw new Error('g is not specified')
		}
		return `${this.shapeUI} ${this.thickness}${
			this.width ? `x${this.width}` : ''
		}`
	}
}

export class Pipe extends Material {
	unit = Unit.M
	shape = MaterialShape.Pipe
	/**
	 * Outer diameter of the pipe in millimeters (mm).
	 * This is the primary dimension used for identification and calculations.
	 */
	diameter!: number

	/**
	 * Wall thickness of the pipe in millimeters (mm).
	 * Used together with diameter to calculate cross-sectional area and mass.
	 */
	thickness!: number
	deriveLabel(): string {
		if (isNaN(this.diameter)) {
			throw new Error('Pipe validation failed: diameter is NaN')
		}
		return `${this.shapeUI} ${this.diameter}x${this.thickness} ${this.alloy}`.trim()
	}
}

export class SquareBar extends Material {
	unit = Unit.M
	shape = MaterialShape.SquareBar
	/**
	 * Side length of the square bar in millimeters (mm).
	 * This is the primary dimension used for identification and calculations.
	 */
	length!: number
	deriveLabel(): string {
		if (!this.length) {
			throw new Error('SquareBar validation failed: length is not specified')
		}
		return `${this.shapeUI} ${this.length} ${this.alloy || ''}`.trim()
	}
}

export class HexagonBar extends Material {
	unit = Unit.M
	shape = MaterialShape.HexagonBar
	diameter!: number
	deriveLabel(): string {
		return `${this.shapeUI} ${this.diameter} ${this.alloy || ''}`.trim()
	}
}

export class Arbitrary extends Material {
	unit = Unit.M
	shape = MaterialShape.Arbitrary
	name!: string
	deriveLabel(): string {
		return `${this.name} ${this.alloy || ''}`.trim()
	}
}

export const MaterialConstructorMap = {
	[MaterialShape.RoundBar]: RoundBar,
	[MaterialShape.List]: List,
	[MaterialShape.Pipe]: Pipe,
	[MaterialShape.SquareBar]: SquareBar,
	[MaterialShape.HexagonBar]: HexagonBar,
	[MaterialShape.Arbitrary]: Arbitrary,
}

export function getMaterialConstructor<T extends MaterialShape>(
	shape: T,
): (typeof MaterialConstructorMap)[T] {
	const c = MaterialConstructorMap[shape]
	if (!c) {
		throw new Error(`Material constructor for shape ${shape} not found`)
	}
	return c
}
