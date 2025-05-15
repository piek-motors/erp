export const schema = 'metal_pdo'

export const enums = {
  unit: `unit_enum`,
  writeoff_reason: `writeoff_reason`,
  material_shape: `material_shape`,
  writeoff_type: `writeoff_type`
}

export const tables = {
  pdo: {
    materials: 'metal_pdo.materials',
    supplies: 'metal_pdo.supplies',
    writeoffs: 'metal_pdo.writeoffs',
    details: 'metal_pdo.details',
    detail_materials: 'metal_pdo.detail_materials'
  },
  erp: {
    users: 'erp.Users'
  }
}
