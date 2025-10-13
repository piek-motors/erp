import { db, procedure, z } from '#root/deps.js'
import { Color } from 'models'

export const setColorAnnotation = procedure
  .input(
    z.object({
      group_id: z.number(),
      detail_id: z.number(),
      colors: z.array(z.enum(Color))
    })
  )
  .mutation(async ({ input }) => {
    await db
      .insertInto('metal_flow.detail_group_color_annotations')
      .values(input)
      .onConflict(oc =>
        oc.columns(['group_id', 'detail_id']).doUpdateSet(input)
      )
      .execute()
  })
