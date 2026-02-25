import { db, procedure, router } from '#root/sdk.js'

export const employees = router({
  list: procedure.query(async () =>
    db.selectFrom('attendance.employees').selectAll().execute(),
  ),
})
