export const schema = 'metal_flow'

export const enums = {
  unit: `unit_enum`,
  writeoff_reason: `writeoff_reason`,
  material_shape: `material_shape`,
  writeoff_type: `writeoff_type`
}

export const tables = {
  pdo: {
    materials: 'metal_flow.materials',
    supplies: 'metal_flow.supplies',
    writeoffs: 'metal_flow.writeoffs',
    details: 'metal_flow.details',
    detail_materials: 'metal_flow.detail_materials'
  },
  erp: {
    users: 'erp.Users'
  }
}
