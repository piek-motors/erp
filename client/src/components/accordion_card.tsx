import { Accordion, AccordionDetails, AccordionSummary, Sheet } from '@mui/joy'
import React, { useEffect, useState } from 'react'

export interface AccordionCardProps {
  title: React.ReactNode
  children: React.ReactNode
  sx?: React.CSSProperties
  defaultExpanded?: boolean
  expanded?: boolean
}

export const AccordionCard: React.FC<AccordionCardProps> = ({
  title,
  children,
  sx,
  defaultExpanded,
  expanded: expandedProp
}) => {
  const key = typeof title === 'string' ? title : String(title)
  const storageKey = `accordion_expanded_${key}`
  const [expanded, setExpanded] = useState<boolean>(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) return stored === 'true'
    return !!defaultExpanded
  })

  useEffect(() => {
    localStorage.setItem(storageKey, String(expanded))
  }, [expanded, storageKey])

  useEffect(() => {
    if (typeof expandedProp === 'boolean') setExpanded(expandedProp)
  }, [expandedProp])

  return (
    <Sheet sx={{ borderRadius: 'sm', ...sx }}>
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => setExpanded(isExpanded)}
      >
        <AccordionSummary>{title}</AccordionSummary>
        <AccordionDetails slotProps={{ content: { sx: { overflow: 'auto' } } }}>
          {children}
        </AccordionDetails>
      </Accordion>
    </Sheet>
  )
}
