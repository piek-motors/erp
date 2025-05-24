export enum AccessLevel {
  Admin = 1,
  Manager = 2,
  ProductionManager = 2,
  Bookkeeper = 3
}

export class User {
  id!: number
  firstName!: string
  lastName?: string | null
  email!: string

  constructor(dto: Partial<User>) {
    Object.assign(this, dto)
  }
}
