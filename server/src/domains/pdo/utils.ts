/**
 * Helper type for detail group details row
 */
export interface DetailGroupDetailRow {
  detail_id: number
  group_id: number
}

/**
 * Creates a map of detail_id to group_ids from pre-fetched data
 */
export function create_detail_group_map(
  group_details: DetailGroupDetailRow[],
): Map<number, number[]> {
  const detail_group_associations = new Map<number, number[]>()
  group_details.forEach(gd => {
    const existing = detail_group_associations.get(gd.detail_id) || []
    detail_group_associations.set(gd.detail_id, [...existing, gd.group_id])
  })

  return detail_group_associations
}
