// TEST_EMAIL= TEST_PASSWORD= npx tsx --test ./src/domains/hr/attendance/upload_events.test.ts
import { it } from 'node:test'

it('upload events', async () => {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    throw new Error('TEST_EMAIL and TEST_PASSWORD must be set')
  }

  // login
  const login_res = await fetch('http://localhost:9000/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'content-type': 'application/json',
    },
  })

  const login_data = await login_res.json()
  const accessToken = login_data.accessToken
  if (!accessToken) {
    console.error(login_data)
    throw new Error('cannot get access')
  }

  const ts = Math.floor(Date.now() / 1000)

  // events
  const events = [
    { id: 19, card: 'card1', ts },
    { id: 20, card: 'card1', ts },
  ]

  const employees = [
    {
      firstname: 'Alpha',
      lastname: 'bettaeedd',
      card: 'card1',
    },
  ]

  const upload_res = await fetch(
    'http://localhost:9000/trpc/hr.attendance.upload_data',
    {
      method: 'POST',
      body: JSON.stringify({ events, employees }),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  const upload_data = await upload_res.json()

  if (!upload_res.ok) {
    console.error(upload_data)
    throw new Error('Upload failed')
  }

  console.log('events uploaded')
  console.log(upload_data)
})
