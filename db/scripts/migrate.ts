import { promises as fs } from 'node:fs'
import { Command } from 'commander'
import {
  FileMigrationProvider,
  type MigrationResultSet,
  Migrator,
} from 'kysely'
import path from 'path'
import { connect } from '../connect.js'

const program = new Command()
  .option('-r, --revert', 'Revert migrations')
  .parse()

const { revert } = program.opts()

const connectionString = process.env.PG_CONN_STR
if (!connectionString) {
  throw new Error('Database connection string is required')
}

const downgrade = revert === 'true' || revert === true
const db = connect(connectionString)

async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(import.meta.dirname, '../migrations'),
    }),
  })

  let res: MigrationResultSet
  if (downgrade) {
    res = await migrator.migrateDown()
  } else {
    res = await migrator.migrateToLatest()
  }

  const { error, results } = res
  if (!res.results) console.info('No migrations to apply')

  results?.forEach(it => {
    if (it.status === 'Success') {
      console.log(
        `migration "${it.migrationName}" was ${
          downgrade ? 'reverted' : 'applied'
        } successfully`,
      )
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })
  await db.destroy()
  if (error) {
    console.error('failed to migrate', error)
  }
}

migrateToLatest().catch(err => console.error(err))
