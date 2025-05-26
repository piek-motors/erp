import assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'
import { MaterialsSyncer } from './materials.syncer.ts'

describe('MaterialsSyncer', () => {
  let instance: MaterialsSyncer

  beforeEach(() => {
    instance = new MaterialsSyncer({
      insertMaterials: async () => {}
    })
  })

  it('should sync materials', async () => {
    const materials = await instance.getMaterialsForSync()
    assert(materials.length > 1, 'Materials length should be greater than 1')
    // console.log('materials', materials)

    for (const m of materials) {
      assert(m.deriveLabel(), 'Material label should be defined')
      const stringifiedMaterial = JSON.stringify(m)

      assert(
        !['null', 'undefined'].includes(stringifiedMaterial),
        'Material should not contain null or undefined'
      )

      assert(
        !['null', 'undefined'].includes(m.deriveLabel()),
        'Material label should be defined correctly'
      )
    }
  })
})
