import { db } from '#root/ioc/db.js'
import { router } from '#root/lib/trpc/trpc.js'
import { procedure } from '#root/sdk.js'
import { attachments } from './attachment.js'
import { attendance } from './attendance/attendance.js'
import { orders } from './orders/orders_router.js'
import { pdo } from './pdo/pdo_router.js'

export const trpcRouter = router({
	orders,
	//
	pdo,
	//
	attachments,
	//
	attendance,
	//
	users: procedure.query(async () =>
		db
			.selectFrom('users')
			.select(['id', 'first_name', 'last_name', 'roles'])
			.where('is_deleted', '=', false)
			.execute(),
	),
	//
	read_notifications: procedure.mutation(async ({ ctx }) => {
		await db
			.updateTable('orders.notifications')
			.set({ seen: true })
			.where('user_id', '=', ctx.user.id)
			.execute()
	}),
})
