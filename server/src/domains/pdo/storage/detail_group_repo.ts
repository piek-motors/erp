import type { DB } from 'db'
import type { Selectable } from 'kysely'
import { z } from 'zod'
import { isDuplicateKeyError } from '#root/lib/kysely.js'
import { type IDB, RpcError } from '#root/sdk.js'

export interface GroupWithParent {
  id: number
  name: string
  parent_id: number | null
}

export interface GroupTreeNode extends GroupWithParent {
  children: GroupTreeNode[]
  depth: number
}

export interface DetailInTheGroup {
  id: number
  name: string
  drawing_number: string | null
  group_ids: number[]
}

const CreateGroupSchema = z.object({
  name: z.string().nonempty(),
  parent_id: z.number().nullish(),
})

const UpdateGroupSchema = CreateGroupSchema.extend({
  id: z.number(),
})

export type CreateGroupInput = z.infer<typeof CreateGroupSchema>
export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>

export class DetailGroupRepo {
  constructor(private readonly db: IDB) {}

  async get_by_id(
    id: number,
  ): Promise<Selectable<DB.DetailGroupTable> | undefined> {
    return await this.db
      .selectFrom('pdo.detail_group')
      .where('id', '=', id)
      .select(['id', 'name', 'parent_id'])
      .executeTakeFirst()
  }

  async get_group_with_details(groupId: number): Promise<{
    group: Selectable<DB.DetailGroupTable>
    details: DetailInTheGroup[]
  }> {
    const [group, detailsInGroup] = await Promise.all([
      this.get_by_id(groupId),
      this.db
        .selectFrom('pdo.detail_group_details as dgd')
        .where('dgd.group_id', '=', groupId)
        .leftJoin('pdo.details as d', 'd.id', 'dgd.detail_id')
        .select(['d.id', 'd.name', 'd.drawing_number'])
        .orderBy('d.name', 'asc')
        .execute(),
    ])

    if (!group) {
      throw RpcError('NOT_FOUND', 'Detail group not found')
    }

    const detail_group_associations = await this.detail_group_associations()
    const detailsData: DetailInTheGroup[] = detailsInGroup.map(d => ({
      id: d.id as number,
      name: d.name as string,
      drawing_number: d.drawing_number as string | null,
      group_ids: detail_group_associations.get(d.id as number) || [],
    }))

    return {
      group,
      details: detailsData,
    }
  }

  async list_groups(): Promise<Selectable<DB.DetailGroupTable>[]> {
    return this.db
      .selectFrom('pdo.detail_group')
      .selectAll()
      .orderBy('name', 'asc')
      .execute()
  }

  /**
   * List all groups as tree structure
   */
  async list_tree(): Promise<GroupTreeNode[]> {
    const all_groups = await this.db
      .selectFrom('pdo.detail_group')
      .selectAll()
      .execute()

    const groupMap = new Map<number, GroupTreeNode>()
    const rootGroups: GroupTreeNode[] = []

    all_groups.forEach(g => {
      groupMap.set(g.id, { ...g, children: [], depth: 0 })
    })

    all_groups.forEach(g => {
      const node = groupMap.get(g.id)!
      if (g.parent_id === null || !groupMap.has(g.parent_id)) {
        rootGroups.push(node)
      } else {
        const parent = groupMap.get(g.parent_id)!
        parent.children.push(node)
      }
    })

    const calculateDepths = (nodes: GroupTreeNode[], depth: number) => {
      nodes.forEach(node => {
        node.depth = depth
        calculateDepths(node.children, depth + 1)
      })
    }
    calculateDepths(rootGroups, 0)

    const sortTree = (nodes: GroupTreeNode[]) => {
      nodes.sort((a, b) =>
        a.name.localeCompare(b.name, 'ru', { numeric: true }),
      )
      nodes.forEach(node => sortTree(node.children))
    }
    sortTree(rootGroups)

    return rootGroups
  }

  async create(
    input: CreateGroupInput,
  ): Promise<Selectable<DB.DetailGroupTable>> {
    try {
      if (input.parent_id) {
        const parent = await this.db
          .selectFrom('pdo.detail_group')
          .select('id')
          .where('id', '=', input.parent_id)
          .executeTakeFirst()
        if (!parent) {
          throw RpcError('BAD_REQUEST', 'Parent group not found')
        }
      }

      const result = await this.db
        .insertInto('pdo.detail_group')
        .values({
          name: input.name,
          parent_id: input.parent_id ?? null,
        })
        .returning(['id', 'name', 'parent_id'])
        .executeTakeFirstOrThrow()

      return result
    } catch (error: any) {
      if (isDuplicateKeyError(error)) {
        throw RpcError('CONFLICT', 'Группа с таким названием уже существует')
      }
      throw error
    }
  }

  async update(
    input: UpdateGroupInput,
  ): Promise<Selectable<DB.DetailGroupTable>> {
    try {
      if (input.parent_id) {
        if (input.parent_id === input.id) {
          throw RpcError('BAD_REQUEST', 'A group cannot be its own parent')
        }
        const is_descendant = await this.check_is_descendant(
          input.parent_id,
          input.id,
        )
        if (is_descendant) {
          throw RpcError('BAD_REQUEST', 'Cannot set a descendant as parent')
        }
      }

      const result = await this.db
        .updateTable('pdo.detail_group')
        .set({
          name: input.name,
          parent_id: input.parent_id ?? null,
        })
        .where('id', '=', input.id)
        .returning(['id', 'name', 'parent_id'])
        .executeTakeFirst()

      if (!result) {
        throw RpcError('NOT_FOUND', 'Detail group not found')
      }
      return result
    } catch (error: any) {
      if (isDuplicateKeyError(error))
        throw RpcError('CONFLICT', 'Группа с таким названием уже существует')

      throw error
    }
  }

  /**
   * Check if a group is a descendant of another group
   */
  async check_is_descendant(
    potentialDescendantId: number,
    targetId: number,
  ): Promise<boolean> {
    const result = await this.db
      .withRecursive('group_hierarchy', db =>
        db
          .selectFrom('pdo.detail_group as dg')
          .select(['dg.id', 'dg.parent_id'])
          .where('dg.id', '=', potentialDescendantId)
          .union(
            db
              .selectFrom('pdo.detail_group as dg')
              .select(['dg.id', 'dg.parent_id'])
              .innerJoin('group_hierarchy as gh', 'dg.id', 'gh.parent_id'),
          ),
      )
      .selectFrom('group_hierarchy as gh')
      .select('gh.id')
      .where('gh.id', '=', targetId)
      .executeTakeFirst()

    return !!result
  }

  /**
   * Get all detail-group associations as a map
   */
  async detail_group_associations(): Promise<Map<number, number[]>> {
    const associations = await this.db
      .selectFrom('pdo.detail_group_details')
      .select(['detail_id', 'group_id'])
      .execute()

    const map = new Map<number, number[]>()
    associations.forEach(({ detail_id, group_id }) => {
      if (!map.has(detail_id)) {
        map.set(detail_id, [])
      }
      map.get(detail_id)!.push(group_id)
    })
    return map
  }
}
