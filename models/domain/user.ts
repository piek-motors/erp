export enum UserRole {
	Admin = 'admin',
	OrderManager = 'order_manager',
	PdoManager = 'pdo_manager',
	StaffManager = 'staff_manager',
}

export class User {
	constructor(
		readonly id: number,
		readonly roles: UserRole[] | null,
		readonly firstName: string,
		readonly lastName: string | null,
		readonly email: string | null,
	) {}

	get fullName() {
		return `${this.firstName} ${this.lastName ?? ''}`.trim()
	}
	get shortName() {
		return `${this.firstName} ${this.lastName?.slice(0, 1)}`.trim()
	}
}
