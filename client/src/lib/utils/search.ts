export type SearchField<T> = {
	/** Extract searchable string from entity */
	get: (item: T) => string
	/** Relative importance of this field */
	weight?: number
	exact?: boolean
}

export interface SearchConfig<T> {
	fields: SearchField<T>[]
	minScore?: number
}

export function toNormalForm(str: string) {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Performs token-based search over a collection with weighted fields.
 *
 * Rules:
 * - Query is split into lowercase tokens by whitespace
 * - Every token MUST match at least one field (AND semantics)
 * - Fields can be fuzzy (includes) or exact (===)
 * - Results are ranked by total accumulated weight
 * - Function is pure and immutable
 */
export function tokenSearch<T>(
	items: readonly T[],
	query: string,
	config: { fields: SearchField<T>[] },
): T[] {
	// Normalize and tokenize query
	const tokens = toNormalForm(query.toLowerCase()).split(/\s+/).filter(Boolean)

	// Empty query → return shallow copy (immutability)
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

						// Exact fields require strict equality (e.g. IDs)
						// Fuzzy fields use substring matching (e.g. labels)
						const matched = field.exact
							? value === token
							: value.includes(token)

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
