export type SearchField<T> = {
  /** Extract searchable string from entity */
  get: (item: T) => string
  /** Relative importance of this field */
  weight?: number
  /** Default match includes */
  match?: 'includes' | 'start_with' | 'exact'
}

export interface SearchConfig<T> {
  fields: SearchField<T>[]
  minScore?: number
}

export function normalize(str?: string | null) {
  if (!str) return ''
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Performs token-based search over a collection with weighted fields.
 *
 * Rules:
 * - Query is split into lowercase tokens by whitespace
 * - Every token MUST match at least one field (AND semantics)
 * - Fields can be fuzzy (includes), start_with, or exact
 * - Results are ranked by total accumulated weight
 * - Function is pure and immutable
 *
 * Note: Normalization should be done by the caller on both query and field values
 */
export function token_search<T>(
  items: readonly T[],
  query: string,
  config: { fields: SearchField<T>[] },
): T[] {
  const queryLower = query.toLowerCase().trim()
  const tokens = queryLower.split(/\s+/).filter(Boolean)

  if (!tokens.length) {
    return items.slice()
  }

  return (
    items
      .map(item => {
        let score = 0

        // Each token must match at least one field
        for (const token of tokens) {
          let tokenMatched = false

          for (const field of config.fields) {
            const value = field.get(item).toLowerCase()

            let matched: boolean

            switch (field.match) {
              case 'exact': {
                matched = value == token
                break
              }
              case 'start_with': {
                // For start_with: check if field starts with token
                // OR if field starts with full query (for multi-word queries)
                matched =
                  value.startsWith(token) || value.startsWith(queryLower)
                break
              }
              default: {
                matched = value.includes(token)
              }
            }

            if (matched) {
              score += field.weight || 1
              tokenMatched = true
            }
          }

          // If any token fails to match → discard item
          if (!tokenMatched) return null
        }

        // Item passed all tokens; keep score for ranking
        return { item, score }
      })
      // Remove rejected items
      .filter((v): v is { item: T; score: number } => v !== null)
      // Higher score = more relevant
      .sort((a, b) => b.score - a.score)
      // Return ranked items only
      .map(v => v.item)
  )
}
