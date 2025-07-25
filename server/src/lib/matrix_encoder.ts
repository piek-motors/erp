/**
 * Encodes an array of objects into a matrix with a typed header row.
 * @param data The array of objects to encode.
 * @returns A matrix where the first row is the keys (headers) and subsequent rows are values.
 */
export function matrixEncoder<T extends object>(
  data: T[]
): (keyof T | T[keyof T])[][] {
  if (!data || data.length === 0) {
    return []
  }

  // 1. Get the keys from the first object. TypeScript knows these are `keyof T`.
  const headers = Object.keys(data[0]) as (keyof T)[]

  // 2. Map each object to an array of its values.
  const rows = data.map(obj => headers.map(header => obj[header]))

  // 3. Return the headers as the first element, followed by the data rows.
  return [headers, ...rows]
}
