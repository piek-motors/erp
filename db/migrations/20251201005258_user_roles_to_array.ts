import { sql } from 'kysely'
import { UserRole } from 'models'
import type { KDB } from '../schema.js'

const transationMap: Record<string, UserRole> = {
  admin: UserRole.Admin,
  order_manager: UserRole.OrderManager,
  bookkeeper: UserRole.OrderManager,
  metalflow_worker: UserRole.PdoManager,
}

export async function up(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE users
    ADD COLUMN roles text[] NOT NULL DEFAULT ARRAY[]::text[];
  `.execute(db)

  const users = await sql<{
    id: number
    role: string
  }>`SELECT id, role FROM users`.execute(db)

  for (const user of users.rows) {
    const existingRole = transationMap[user.role]
    if (!existingRole) {
      continue
    }
    await sql`
      UPDATE users
      SET roles = ARRAY[${existingRole}]
      WHERE id = ${user.id};
    `.execute(db)
  }

  await sql`
    ALTER TABLE users
    DROP COLUMN role;
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE users
    ADD COLUMN role text NOT NULL DEFAULT 'staff_manager';
    ALTER TABLE users
    DROP COLUMN roles;
  `.execute(db)
}
