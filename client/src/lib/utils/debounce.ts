/**
 * Creates a debounced function that delays invoking `callback` until after
 * `waitFor` milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param callback The function to debounce.
 * @param waitFor The number of milliseconds to delay.
 * @returns A new, debounced function.
 */
export const debounce = <F extends (...args: any[]) => any>(
  callback: F,
  waitFor: number,
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      callback(...args)
    }, waitFor)
  }
}
