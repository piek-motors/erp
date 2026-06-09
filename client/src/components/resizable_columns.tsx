import { Box } from '@mui/joy'
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

interface ResizableColumnsProps {
  left: ReactNode
  right: ReactNode
  storageKey: string
  defaultLeftPct?: number
  minPct?: number
  maxPct?: number
}

export const ResizableColumns = ({
  left,
  right,
  storageKey,
  defaultLeftPct = 50,
  minPct = 20,
  maxPct = 80,
}: ResizableColumnsProps) => {
  const [leftPct, setLeftPct] = useState(() => {
    const stored = localStorage.getItem(storageKey)
    return stored !== null ? Number(stored) : defaultLeftPct
  })
  const leftPctRef = useRef(leftPct)
  leftPctRef.current = leftPct
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem(storageKey, String(leftPct))
  }, [leftPct, storageKey])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startPct = leftPctRef.current
      const container = containerRef.current
      if (!container) return

      const onMouseMove = (e: MouseEvent) => {
        const containerWidth = container.getBoundingClientRect().width
        const dx = e.clientX - startX
        const newPct = Math.min(
          maxPct,
          Math.max(minPct, startPct + (dx / containerWidth) * 100),
        )
        setLeftPct(newPct)
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [minPct, maxPct],
  )

  return (
    <Box
      ref={containerRef}
      sx={{ display: 'flex', gap: 0, alignItems: 'stretch' }}
    >
      <Box
        sx={{
          width: `${leftPct}%`,
          minWidth: `${minPct}%`,
          overflow: 'hidden',
        }}
      >
        {left}
      </Box>
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          width: '8px',
          flexShrink: 0,
          cursor: 'col-resize',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          '&:hover .drag-handle-line': { opacity: 1 },
        }}
      >
        <Box
          className="drag-handle-line"
          sx={{
            width: '2px',
            background: 'var(--joy-palette-divider)',
            opacity: 0.3,
            transition: 'opacity 0.15s',
          }}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: `${100 - maxPct}%`, overflow: 'hidden' }}>
        {right}
      </Box>
    </Box>
  )
}
