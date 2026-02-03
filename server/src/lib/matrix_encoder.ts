export type Matrix<T extends object> = (keyof T | T[keyof T])[][]
/**
 * Encodes an array of objects into a matrix with a typed header row.
 * @param data The array of objects to encode.
 * @returns A matrix where the first row is the keys (headers) and subsequent rows are values.
 */
export function matrixEncoder<T extends object>(
  data: T[],
): (keyof T | T[keyof T])[][] {
  if (!data || data.length === 0) {
    return []
  }

  const headers = Object.keys(data[0]) as (keyof T)[]
  const rows = data.map(obj => headers.map(header => obj[header]))
  return [headers, ...rows]
}
