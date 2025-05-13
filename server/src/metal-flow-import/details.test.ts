import assert from 'node:assert'
import { describe, it } from 'node:test'
import type { PipeShapeData } from 'shared'
import { MaterialParser } from './material-parser.ts'

describe('details-parser', () => {
  const parser = new MaterialParser()

  it('should parse pipes', () => {
    const pipe = parser.parsePipe('труба ф 114х8 ст 20')
    const shape = pipe.shapeData as PipeShapeData
    assert.equal(shape.diameter, 114)
    assert.equal(shape.thickness, 8)
  })
})
