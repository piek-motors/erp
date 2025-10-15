import { db, procedure, TRPCError } from '#root/deps.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { Color } from 'models'
import { z } from 'zod'

export interface DetailInTheGroup {
  id: number
  name: string
  part_code: string | null
  group_id: number | null
  colors: Color[]
}

export const getDetailInTheGroup = procedure
  .input(
    z.object({
      groupId: z.number()
    })
  )
  .query(async ({ input }) => {
    const [group, details, directDetails, colorAnnotations] = await Promise.all(
      [
        db
          .selectFrom('pdo.detail_group')
          .where('id', '=', input.groupId)
          .select(['id', 'name'])
          .executeTakeFirst(),
        db
          .selectFrom('pdo.detail_group_details as dgd')
          .where('dgd.group_id', '=', input.groupId)
          .leftJoin('pdo.details as d', 'd.id', 'dgd.detail_id')
          .where('d.logical_group_id', 'is', null)
          .select(['d.id', 'd.name', 'd.part_code', 'd.logical_group_id'])
          .orderBy('d.name', 'asc')
          .execute(),
        db
          .selectFrom('pdo.details')
          .select(['id', 'name', 'part_code', 'logical_group_id'])
          .where('logical_group_id', '=', input.groupId)
          .execute(),
        db
          .selectFrom('pdo.detail_group_color_annotations')
          .where('group_id', '=', input.groupId)
          .select(['detail_id', 'colors'])
          .execute()
      ]
    )
    if (!group) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Detail group not found'
      })
    }

    const detailsData: DetailInTheGroup[] = [...directDetails, ...details].map(
      d => ({
        id: d.id as number,
        name: d.name as string,
        part_code: d.part_code as string | null,
        group_id: d.logical_group_id as number | null,
        colors: colorAnnotations.find(ca => ca.detail_id === d.id)
          ?.colors as Color[]
      })
    )

    return {
      group,
      details: matrixEncoder(detailsData)
    }
  })
