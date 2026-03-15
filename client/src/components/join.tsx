type JoinProps<T> = {
  items: T[]
  render: (item: T, index: number) => React.ReactNode
  separator: React.ReactNode
  getKey?: (item: T, index: number) => React.Key
}

export function Join<T>({ items, render, separator, getKey }: JoinProps<T>) {
  return (
    <>
      {items.map((item, i) => (
        <span key={getKey?.(item, i) ?? i}>
          {i > 0 && separator}
          {render(item, i)}
        </span>
      ))}
    </>
  )
}
