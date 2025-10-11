export const routeMap = {
  index: '/',
  mentions: '/mentions',
  settings: '/settings',
  reclamation: '/reclamation',
  attendance: '/attendance',

  order: {
    new: '/orders/new',
    view: '/orders/:id'
  },

  orders: {
    preOrders: '/orders/pending',
    priorityList: '/orders/priority',
    recentlyPaid: '/orders/recently-paid',
    report: '/orders/report',
    archiveSearch: '/orders/archive'
  },

  pdo: {
    index: '/metalflow',

    materials: '/metalflow/materials',
    material: {
      new: '/metalflow/materials/new',
      edit: '/metalflow/materials/:id'
    },

    details: '/metalflow/details',
    detail: {
      new: '/metalflow/details/new',
      edit: '/metalflow/details/:id'
    },
    detailGroups: '/metalflow/details/groups',
    detailGroup: '/metalflow/details/groups/:id',

    operations: '/metalflow/operations',
    manufacturing_orders: '/metalflow/manufacturing',
    manufacturing_order: {
      edit: '/metalflow/manufacturing/:id'
    }
  }
} as const

export function openPage(
  page: string,
  id?: string | number,
  params: Record<string, any> = {}
) {
  let path = page

  if (id && path.includes(':id')) {
    path = path.replace(':id', String(id))
  }

  const query = new URLSearchParams(params).toString()
  return query ? `${path}?${query}` : path
}

export function openOrderDetailPage(orderId: string | number) {
  return `/orders/${orderId}`
}
