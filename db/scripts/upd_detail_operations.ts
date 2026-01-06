import { Command } from 'commander'
import dotenv from 'dotenv'
import { KDB } from 'schema'
import { connect } from '../connect'

const prog = new Command()
  .requiredOption('--old <name>', 'Old operation name to replace')
  .requiredOption('--new <name>', 'New name for operation')
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
  const { new: new_operation_name, old: old_opearaion_name } = prog.opts()
  console.log('upd starts')
  const details = await db
    .selectFrom('pdo.details')
    .select(['id', 'processing_route'])
    .where('processing_route', 'is not', null)
    .execute()
  const dict = await db
    .selectFrom('pdo.dict_operation_kinds')
    .selectAll()
    .execute()

  const old_op_id = dict.find(op => op.v == old_opearaion_name)?.id
  const new_op_id = dict.find(op => op.v == new_operation_name)?.id
  if (!old_op_id)
    throw Error(
      `cannot find old operation ${old_opearaion_name} from dictionary`
    )
  if (!new_op_id)
    throw Error(
      `cannot find new operation ${new_operation_name} from dictionary`
    )

  const promises: Promise<any>[] = []
  for (const d of details) {
    if (!d.processing_route) continue
    let shoudlUpdate = false

    let update = d.processing_route.steps.map(operation_id => {
      if (operation_id === old_op_id) {
        shoudlUpdate = true
        return new_op_id
      }

      return operation_id
    })

    if (shoudlUpdate) {
      promises.push(
        db
          .updateTable('pdo.details')
          .set({ processing_route: { steps: update } })
          .where('id', '=', d.id)
          .executeTakeFirstOrThrow()
      )
    }
  }

  await Promise.all(promises)
  console.log(`Updated ${promises.length} details`)
}

main()
