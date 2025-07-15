import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { info } from 'console'
import {
  EnMaterialShape,
  EnUnit,
  MaterialConstructorMap,
  MaterialShapeAbstractionLayer
} from 'domain-model'
import { z } from 'zod'

export const createMaterial = publicProcedure
  .input(
    z.object({
      unit: z.nativeEnum(EnUnit),
      shape: z.nativeEnum(EnMaterialShape),
      label: z.string().nonempty(),
      shape_data: z.any(),
      linear_mass: z.number(),
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
      .insertInto('metal_flow.materials')
      .values({
        ...input,
        label,
        stock: 0,
        linear_mass: input.linear_mass,
        alloy: input.alloy
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    info(`New material created: ${label}`)
    return material
  })
