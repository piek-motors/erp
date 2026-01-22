export const Minute = 60 * 1000
export const Hour = 60 * Minute
export const Day = 24 * Hour

export const ordersScope = (s: string) => `orders:${s}` as const
export const attendaceScope = (s: string) => `attendance:${s}` as const
export const pdoScope = (s: string) => `pdo:${s}` as const

export const Scope = {
	orders: ordersScope('*'),
	staff: attendaceScope('*'),
	pdo: pdoScope('*'),
} as const

export type Scope = (typeof Scope)[keyof typeof Scope]
