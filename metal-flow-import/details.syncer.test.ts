import { DetailSyncer } from 'details.syncer.ts'
import { beforeEach, describe, it } from 'node:test'

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
    // const materials = await instance.()
    // assert(materials.length > 1, 'Materials length should be greater than 1')
    // // console.log('materials', materials)
    // for (const m of materials) {
    //   assert(m.deriveLabel(), 'Material label should be defined')
    //   const stringifiedMaterial = JSON.stringify(m)
    //   assert(
    //     !['null', 'undefined'].includes(stringifiedMaterial),
    //     'Material should not contain null or undefined'
    //   )
    //   assert(
    //     !['null', 'undefined'].includes(m.deriveLabel()),
    //     'Material label should be defined correctly'
    //   )
    // }
  })
})
