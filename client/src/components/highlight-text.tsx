import { P } from 'lib/index'

interface HighlightTextProps {
  text: string
  highlight: string
  highlightColor?: string
  caseSensitive?: boolean
}

export function HighlightText({
  text,
  highlight,
  highlightColor = '#ffeb3b',
  caseSensitive = false
}: HighlightTextProps) {
  if (!highlight) {
    return <P>{text}</P>
  }

  const flags = caseSensitive ? 'g' : 'gi'
  const parts = text.split(new RegExp(`(${highlight})`, flags))

  return (
    <P>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} style={{ backgroundColor: highlightColor }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </P>
  )
}
