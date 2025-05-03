// Define route paths using an enum for consistency
export enum AppRoutes {
  help = '/help',
  mentions = '/mentions',
  orders = '/orders',
  order_detail = '/orders/:id', // Updated to include the dynamic :id parameter
  settings = '/settings',
  reclamation = '/reclamation',
  attendance = '/attendance'
}

export enum MetalFlowSys {
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
