/* eslint-disable no-loop-func */
import { NullTimeError, timedeltaInSeconds } from 'lib/date'

export function joinAffilatedIntervals<
  O extends Array<{
    ent?: string | null
    ext?: string | null
  }>
>(user_intervals: O) {
  const initial_value: O[number] & { dur: number } = {
    dur: 0,
    ext: null,
    ent: 'qwe'
  }

  return (
    user_intervals
      .slice()
      // разворачиваем массив поскольку нужно найти последнюю отметку выхода и зафиксировать ее
      .reverse()
      .reduce<typeof initial_value>((acc, cur) => {
        const durationOrError = timedeltaInSeconds(cur.ent, cur.ext)
        const duration_s = !(durationOrError instanceof NullTimeError)
          ? durationOrError
          : 0

        return cur.ext && !acc.ext
          ? // Берет посделний интервал у которого есть время выхода
            {
              ent: cur.ent,
              ext: cur.ext,
              dur: duration_s
            }
          : {
              ...acc,
              ent: cur.ent,
              dur: acc.dur + duration_s
            }
      }, initial_value)
  )
}
