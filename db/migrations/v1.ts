import { sql } from 'kysely'
import { enums, schema, tables } from '../const'
import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  // Create schema
  await db.schema.createSchema(schema).execute()

  // Create materials table
  await db.schema
    .createTable(tables.pdo.materials)
    .addColumn('id', 'serial', b => b.primaryKey())
    .addColumn('name', 'text')
    .addColumn('unit', 'text', b => b.notNull())
    .addColumn('shape', 'text', b => b.notNull())
    .addColumn('shape_data', 'jsonb')
    .execute()

  // Create stock table
  await db.schema
    .createTable(`metal_pdo.stock`)
    .addColumn('material_id', 'integer', b =>
      b.primaryKey().references('metal_pdo.materials.id').onDelete('cascade')
    )
    .addColumn('current_qty', 'numeric', b =>
      b
        .notNull()
        .defaultTo(0)
        .check(sql`current_qty >= 0`)
    )
    .execute()

  // Create supplies table
  await db.schema
    .createTable(tables.pdo.supplies)
    .addColumn('id', 'serial', b => b.primaryKey())
    .addColumn('material_id', 'integer', b =>
      b.references('metal_pdo.materials.id').notNull()
    )
    .addColumn('qty', 'numeric', b => b.notNull().check(sql`qty > 0`))
    .addColumn('supplied_at', 'timestamp', b => b.notNull())
    .addColumn('supplier_name', 'text', b => b.notNull())
    .execute()

  // Create writeoffs table
  await db.schema
    .createTable(tables.pdo.writeoffs)
    .addColumn('id', 'serial', b => b.primaryKey())
    .addColumn('material_id', 'integer', b =>
      b.references('metal_pdo.materials.id').notNull()
    )
    .addColumn('qty', 'numeric', b => b.notNull().check(sql`qty > 0`))
    .addColumn('writeoff_at', 'timestamp', b => b.notNull())
    .addColumn('reason', 'text', b => b.notNull())
    .execute()

  // Create trigger function for supplies using raw SQL
  await sql`
    CREATE FUNCTION metal_pdo.update_stock_on_supply() RETURNS trigger AS $$
    BEGIN
        INSERT INTO metal_pdo.stock (material_id, current_qty)
        VALUES (NEW.material_id, NEW.qty)
        ON CONFLICT (material_id)
        DO UPDATE SET current_qty = metal_pdo.stock.current_qty + NEW.qty;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db)

  // Create trigger function for writeoffs using raw SQL
  await sql`
    CREATE FUNCTION metal_pdo.update_stock_on_writeoff() RETURNS trigger AS $$
    BEGIN
        IF (SELECT current_qty FROM metal_pdo.stock WHERE material_id = NEW.material_id) < NEW.qty THEN
            RAISE EXCEPTION 'Insufficient stock for material_id %', NEW.material_id;
        END IF;
        UPDATE metal_pdo.stock
        SET current_qty = current_qty - NEW.qty
        WHERE material_id = NEW.material_id;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db)

  // Create trigger for supplies using raw SQL
  await sql`
    CREATE TRIGGER supplies_after_insert
    AFTER INSERT ON metal_pdo.supplies
    FOR EACH ROW
    EXECUTE FUNCTION metal_pdo.update_stock_on_supply();
  `.execute(db)

  // Create trigger for writeoffs using raw SQL
  await sql`
    CREATE TRIGGER writeoffs_before_insert
    BEFORE INSERT ON metal_pdo.writeoffs
    FOR EACH ROW
    EXECUTE FUNCTION metal_pdo.update_stock_on_writeoff();
  `.execute(db)
}

export const down = async (db: KDB) => {
  // Drop schema and types
  await db.schema.dropSchema(schema).cascade().execute()

  // delete all enums
  await db.schema.dropType(enums.unit).execute()
  await db.schema.dropType(enums.writeoff_reason).execute()
  await db.schema.dropType(enums.material_shape).execute()
}
