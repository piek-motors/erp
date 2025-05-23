// Define route paths using an enum for consistency
export enum AppRoutes {
  help = '/help',
  mentions = '/mentions',
  order_detail = '/order/:id',
  settings = '/settings',
  reclamation = '/reclamation',
  attendance = '/attendance'
}

// Helper function to generate order detail URL
export function openOrderDetailPage(orderId: string | number) {
  return `/order/${orderId}`
}

export enum MetalFlowRoutes {
  root = `/metalflow/`,
  nav = `/metalflow/nav`,
  materials = `materials`,
  material_add = `material/add`,
  material_update = `material/update`,
  details = `details`,
  detail_add = `detail/add`,
  detail_update = `details/update/`,
  supplies = `supplies`,
  supply_add = `supply/add`,
  writeoffs = `writeoffs`,
  writeoff_add = `writeoff/add`
}

export function openMetalFlowPage(
  page: MetalFlowRoutes,
  id?: string | number,
  params: Record<string, any> = {}
) {
  let s = `?path=${page}`
  if (id) {
    s = s.concat(`&id=${id}`)
  }
  if (Object.keys(params).length > 0) {
    s = s.concat(`&${new URLSearchParams(params).toString()}`)
  }
  return s
}

export enum ListOrdersRoutes {
  pre_orders = '/orders/pending',
  priority_list = '/orders/priority',
  recent_paid_orders = '/orders/recently-paid',
  report = '/orders/report',
  search_in_archive = '/orders/archive'
}
