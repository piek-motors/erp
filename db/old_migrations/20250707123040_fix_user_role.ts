import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    CREATE TYPE user_role AS ENUM ('admin', 'order_manager', 'bookkeeper', 'metalflow_worker', 'warehouse_bookkeeper')
  `.execute(db)

  const allUsers = await db.selectFrom('users').selectAll().execute()
  await sql`
    ALTER TABLE users 
    DROP COLUMN role,
    ADD COLUMN role user_role NOT NULL DEFAULT 'bookkeeper';
  `.execute(db)

  // for (const user of allUsers) {
  //   let role: UserRole | null = null

  //   switch (user.role as any as number) {
  //     case 1:
  //       role = UserRole.Admin
  //       break
  //     case 2:
  //       role = UserRole.OrderManager
  //       break
  //     default:
  //       role = UserRole.Bookkeeper
  //       break
  //   }

  //   if (role === null) {
  //     throw new Error(
  //       `Unknown role: ${user.role} for user ${user.id} ${user.first_name} ${user.last_name}`
  //     )
  //   }
  //   await db
  //     .updateTable('users')
  //     .set({
  //       role
  //     })
  //     .where('id', '=', user.id)
  //     .execute()
  // }
}

export async function down(db: KDB): Promise<void> {
  await sql`
    DROP TYPE user_role
  `.execute(db)
}
