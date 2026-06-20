/**
 * Returns the shallow field-level differences between two records in a
 * structured form suitable for logging.
 */
export function changed_fields(
  existing: Record<string, unknown>,
  updated: Record<string, unknown>,
): Record<string, string> {
  const changes: Record<string, string> = {}
  const fields = new Set([...Object.keys(existing), ...Object.keys(updated)])

  for (const field of fields) {
    const from = existing[field]
    const to = updated[field]

    if (!Object.is(from, to)) {
      changes[field] = `${from} -> ${to}`
    }
  }

  return changes
}
