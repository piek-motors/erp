import type { DB, Selectable } from 'db'
import { db, procedure, router, z } from '#root/sdk.js'

export type DictEntry = Selectable<DB.Dict<string>>

export const create_dict_router = <TE extends keyof DB.Schema & string>(
	table: TE,
) =>
	router({
		ls: procedure.query(
			async (): Promise<{ id: number; v: any }[]> =>
				db.selectFrom(table).selectAll().execute() as Promise<DictEntry[]>,
		),
		add: procedure
			.input(z.object({ v: z.any() }))
			.mutation(async ({ input }) => {
				const [created] = await db
					.insertInto(table)
					.values({ v: input.v } as any)
					.returningAll()
					.execute()
				return created as Promise<DictEntry>
			}),
		rm: procedure
			.input(z.object({ id: z.number() }))
			.mutation(async ({ input }) => {
				await db
					.deleteFrom(table)
					.where('id' as any, '=', input.id)
					.execute()
			}),
	})
