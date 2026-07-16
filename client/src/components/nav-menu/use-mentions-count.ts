import { useEffect, useState } from 'react'
import { rpc } from '@/lib/rpc/rpc.client'
import { authStore } from '@/lib/store/auth.store'

export function useMentionsCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const userId = authStore.user?.id
    if (!userId) return

    rpc.orders.mentions.count
      .query({ user_id: userId })
      .then(setCount)
      .catch(err => console.error('Failed to fetch mentions count:', err))
  }, [])

  return count
}
