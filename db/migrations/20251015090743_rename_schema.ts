import { sql } from 'kysely'
import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await sql`
    ALTER SCHEMA metal_flow RENAME TO pdo;
  `.execute(db)

  // Add ON DELETE CASCADE to manufacturing.detail_id
  await sql`
    ALTER TABLE pdo.manufacturing
    DROP CONSTRAINT manufacturing_detail_id_fkey,
    ADD CONSTRAINT manufacturing_detail_id_fkey
      FOREIGN KEY (detail_id)
      REFERENCES pdo.details(id)
      ON DELETE CASCADE;
  `.execute(db)

  // Add ON DELETE CASCADE to operations.detail_id
  await sql`
    ALTER TABLE pdo.operations
    DROP CONSTRAINT operations_detail_id_fkey,
    ADD CONSTRAINT operations_detail_id_fkey
      FOREIGN KEY (detail_id)
      REFERENCES pdo.details(id)
      ON DELETE SET NULL;
  `.execute(db)

  // Add ON DELETE CASCADE to detail_group_details.detail_id
  await sql`
    ALTER TABLE pdo.detail_group_details
    DROP CONSTRAINT detail_group_details_detail_id_fkey,
    ADD CONSTRAINT detail_group_details_detail_id_fkey
      FOREIGN KEY (detail_id)
      REFERENCES pdo.details(id)
      ON DELETE CASCADE;
  `.execute(db)

  // Add ON DELETE SET NULL to operations.manufacturing_order_id
  await sql`
    ALTER TABLE pdo.operations
    DROP CONSTRAINT operations_manufacturing_order_id_fkey,
    ADD CONSTRAINT operations_manufacturing_order_id_fkey
      FOREIGN KEY (manufacturing_order_id)
      REFERENCES pdo.manufacturing(id)
      ON DELETE SET NULL;
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER SCHEMA pdo RENAME TO metal_flow;
  `.execute(db)
}
