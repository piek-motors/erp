import type { Generated, GeneratedAlways, Selectable } from 'kysely'
import type { UserRole } from 'shared'

export interface UserTable {
  id: GeneratedAlways<number>
  first_name: string
  last_name: string
  email: string
  roles: UserRole[]
  password: string
  is_deleted: boolean
}

export interface AttachmentTable {
  id: Generated<number>
  key: string
  filename: string
  size: number
  uploaded_at: Date
}
export type Attachment = Selectable<AttachmentTable>

export interface RefreshTokenTable {
  id: Generated<number>
  token: string
  user_id: number
  created_at: Generated<Date>
}
