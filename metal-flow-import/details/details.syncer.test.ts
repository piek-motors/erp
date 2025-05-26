import { beforeEach, describe, it } from 'node:test'
import { DetailSyncer } from './details.syncer.ts'

describe('DetailsSyncer', () => {
  let instance: DetailSyncer

  beforeEach(() => {
    instance = new DetailSyncer({
      getAllMaterials: async () => [],
      insertMaterials: async () => {},
      saveDetailsAndRelations: async () => {}
    })
  })

  it('should parse details', async () => {
    const materials = await instance.parseTable()
    console.log(materials)
  })
})
