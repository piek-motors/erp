export class User {
  id!: number
  firstName!: string
  lastName?: string | null
  email!: string

  constructor(dto: Partial<User>) {
    Object.assign(this, dto)
  }
}
