import { db, TRPCError } from '#root/deps.js'
import { isDuplicateKeyError } from '#root/lib/kysely.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { info } from 'console'
import {
  MaterialConstructorMap,
  MaterialShape,
  MaterialShapeAbstractionLayer,
  Unit
} from 'models'
import { z } from 'zod'

export const createMaterial = publicProcedure
  .input(
    z.object({
      unit: z.enum(Unit).nullable(),
      shape: z.enum(MaterialShape),
      label: z.string().nonempty(),
      shape_data: z.any(),
      // linear_mass: z.number(),
      alloy: z.string().nullable()
    })
  )
  .mutation(async ({ input }) => {
    const constructor = MaterialConstructorMap[input.shape]
    const materialModel = new constructor(input.shape_data, '', input.alloy)
    MaterialShapeAbstractionLayer.importShapeData(
      materialModel,
      input.shape_data
    )
    const label = materialModel.deriveLabel()
    const material = await db
      .insertInto('pdo.materials')
      .values({
        ...input,
        unit: input.unit ?? Unit.M,
        label,
        stock: 0,
        linear_mass: 0,
        alloy: input.alloy,
        safety_stock: 0
      })
      .returningAll()
      .executeTakeFirstOrThrow()
      .catch(e => {
        if (isDuplicateKeyError(e)) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Материал с таким названием уже существует'
          })
        }
        throw e
      })

    info(`New material created: ${label}`)
    return material
  })
