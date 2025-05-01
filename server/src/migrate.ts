import { promises as fs } from 'fs'
import {
  FileMigrationProvider,
  Migrator,
  type MigrationResultSet
} from 'kysely'
import * as path from 'path'
import { db } from './db/conn.ts'

const args = process.argv.slice(2)

const downgrade = args[0] === 'down'
const __dirname = new URL('.', import.meta.url).pathname

async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../src/db/migrations')
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

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest().catch(err => console.error(err))
