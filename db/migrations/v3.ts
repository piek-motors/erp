import { sql } from 'kysely'
import { tables } from '../const'
import type { KDB } from '../schema'

export const up = async (db: KDB) => {
  // alter table supplies drop column matrertial_id and add column material_id integer references metal_flow.materials(id) on delete cascade;
  await db.schema
    .alterTable(tables.pdo.supplies)
    .dropColumn('material_id')
    .execute()

  await db.schema
    .alterTable(tables.pdo.supplies)
    .addColumn('material_id', 'integer', b =>
      b.references('metal_flow.materials.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .alterTable(tables.pdo.writeoffs)
    .dropColumn('material_id')
    .execute()

  await db.schema
    .alterTable(tables.pdo.writeoffs)
    .addColumn('material_id', 'integer', b =>
      b.references('metal_flow.materials.id').onDelete('cascade')
    )
    .execute()

  await db.schema.dropTable('metal_flow.stock').ifExists().execute()

  await sql`
  drop function if exists metal_flow.update_stock_on_writeoff cascade;
  drop function if exists metal_flow.update_stock_on_supply cascade;
  `.execute(db)

  await sql`
    drop trigger if exists supplies_after_insert on metal_flow.supplies cascade;
    drop trigger if exists writeoffs_before_insert on metal_flow.writeoffs cascade;  
  `.execute(db)

  await sql`
    drop table metal_flow.writeoffs cascade;
  `.execute(db)

  await sql`
  create table metal_flow.writeoffs (
    id serial primary key,
    material_id integer not null references metal_flow.materials(id) on delete cascade,
    date timestamptz not null,
    qty numeric not null,
    reason integer not null,
    type integer not null,
    type_data jsonb not null
  )
  `.execute(db)

  await db.schema
    .alterTable(tables.pdo.detail_materials)
    .addColumn('cost', 'numeric')
    .execute()

  await db.schema.alterTable(tables.pdo.materials).dropColumn('unit').execute()
  await db.schema
    .alterTable(tables.pdo.materials)
    .addColumn('unit', 'integer', b => b.notNull().defaultTo(0))
    .execute()

  // add unique constraint to detain names
  await sql`
    DELETE from metal_flow.details;
    CREATE UNIQUE INDEX detail_name_unique_idx ON metal_flow.details (name);
  `.execute(db)
}

export const down = async (db: KDB) => {
  await db.schema
    .alterTable(tables.pdo.detail_materials)
    .dropColumn('cost')
    .execute()
}
