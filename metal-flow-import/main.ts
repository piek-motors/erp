import { log } from 'console'
import { connect } from 'db'
import dotenv from 'dotenv'
import { DetailSyncer } from './details/details.syncer'
import { DetailSequence } from './details/sequence'
import { MaterialsSyncer } from './materials/materials.syncer'
import { MaterialSequence } from './materials/sequence'
import { Repo } from './repo'

dotenv.config({
  path: '../.env'
})

async function main() {
  try {
    const connStr = process.env['PG_CONN_STR']
    if (!connStr) {
      throw new Error('PG_CONN_STR is not set')
    }

    const db = connect(connStr)
    const repo = new Repo(db)
    const detailSyncer = new DetailSyncer(repo)
    const materialsSyncer = new MaterialsSyncer(repo)
    await repo.drop()
    log('start syncing materials.csv')
    await materialsSyncer.sync()
    log('finished syncing materials.csv')

    log('start syncing details.csv')
    MaterialSequence.reset()
    DetailSequence.reset()
    await detailSyncer.sync()

    log('detail insert error count', repo.detailInsertErrCount)
    log(
      'detail material relation insert error count',
      repo.detailMaterialRelationInsertErrCount
    )
    await repo.updateSequences()
    log('finished syncing details.csv')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
