import { connect } from 'db'
import { DetailSyncer } from 'details.syncer'
import { MaterialsSyncer } from 'materials.syncer'
import { Repo } from 'repo'

async function main() {
  try {
    const connStr = process.env.PG_CONN_STR
    if (!connStr) {
      throw new Error('PG_CONN_STR is not set')
    }

    const db = connect(connStr)
    const repo = new Repo(db)
    const detailSyncer = new DetailSyncer(repo)
    const materialsSyncer = new MaterialsSyncer(repo)
    await repo.drop()
    await materialsSyncer.getMaterialsForSync()
    await detailSyncer.sync()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
