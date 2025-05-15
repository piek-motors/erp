import { config } from 'dotenv'
import { promises as fs } from 'node:fs'
import {
  FileMigrationProvider,
  Migrator,
  type MigrationResultSet
} from 'kysely'
import * as path from 'path'
import { Command } from 'commander'
import { connect } from './connect'

const program = new Command()
  .option('-r, --revert', 'Revert migrations')
  .parse()

const { revert } = program.opts()

config()
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
      migrationFolder: path.join(__dirname, './migrations')
    })
  })

  let res: MigrationResultSet
  if (downgrade) {
    res = await migrator.migrateDown()
  } else {
    res = await migrator.migrateToLatest()
  }

  const { error, results } = res

  results?.forEach(it => {
    if (it.status === 'Success') {
      console.log(
        `migration "${it.migrationName}" was ${
          downgrade ? 'reverted' : 'applied'
        } successfully`
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
