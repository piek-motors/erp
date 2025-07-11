import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('refresh_tokens')
    .addColumn('created_at', 'timestamp')
    .execute()

  await sql`
  CREATE INDEX refresh_tokens_token_hash ON refresh_tokens USING hash (token);
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('refresh_tokens')
    .dropColumn('created_at')
    .execute()

  await sql`
  DROP INDEX refresh_tokens_token_hash;
  `.execute(db)
}
