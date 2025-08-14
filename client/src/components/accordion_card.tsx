import { Accordion, AccordionDetails, AccordionSummary, Sheet } from '@mui/joy'
import React, { useEffect, useState } from 'react'

export interface AccordionCardProps {
  title: React.ReactNode
  children: React.ReactNode
  sx?: React.CSSProperties
  defaultExpanded?: boolean
}

export const AccordionCard: React.FC<AccordionCardProps> = ({
  title,
  children,
  sx,
  defaultExpanded
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

  return (
    <Sheet sx={{ borderRadius: 'sm', overflow: 'hidden', ...sx }}>
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => setExpanded(isExpanded)}
      >
        <AccordionSummary>{title}</AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Sheet>
  )
}
