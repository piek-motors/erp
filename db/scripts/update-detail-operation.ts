import { Command } from 'commander'
import dotenv from 'dotenv'
import { KDB } from 'schema'
import { connect } from '../connect'

const prog = new Command()
  .requiredOption('--old <name>', 'Operation name to replace')
  .requiredOption('--new <name>', 'new na,e for operation')
  .parse(process.argv)

function main() {
  dotenv.config({ path: '../.env' })
  const dbConnectionUrl = process.env['PG_CONN_STR']
  if (!dbConnectionUrl) {
    throw new Error('PG_CONN_STR is not set')
  }
  const db = connect(dbConnectionUrl)
  return updateOperationNames(db)
}

async function updateOperationNames(db: KDB) {
  const { new: newName, old } = prog.opts()
  console.log('upd starts')
  const details = await db
    .selectFrom('pdo.details')
    .select(['id', 'processing_route'])
    .where('processing_route', 'is not', null)
    .execute()

  const promises: Promise<any>[] = []

  for (const d of details) {
    if (!d.processing_route) continue

    let shoudlUpdate = false

    d.processing_route.steps.forEach(each => {
      if (each.name === old) {
        shoudlUpdate = true
        each.name = newName
      }
    })

    if (shoudlUpdate) {
      promises.push(
        db
          .updateTable('pdo.details')
          .set({ processing_route: d.processing_route })
          .where('id', '=', d.id)
          .execute()
      )
    }
  }

  await Promise.all(promises)
  console.log(`Updated ${promises.length} details`)
}

main()
