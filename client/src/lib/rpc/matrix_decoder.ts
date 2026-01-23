/**
 * Decodes a matrix with a header row back into a typed array of objects.
 * @param matrix The matrix received from the server, typically `any[][]`.
 * @returns The reconstructed array of objects, typed as `T[]`.
 */
export function matrixDecoder<T extends object>(matrix: any[][]): T[] {
	if (!matrix || matrix.length < 2) {
		// Need at least a header row and one data row.
		return []
	}

	// 1. Extract the headers and the data rows.
	const [headers, ...rows] = matrix

	// 2. Map each row back to an object of type T.
	return rows.map(row => {
		// We assert the empty object is of type T.
		const obj = {} as T

		headers.forEach((header: keyof T, index: number) => {
			obj[header] = row[index]
		})

		return obj
	})
}
