import { Accordion, AccordionDetails, AccordionSummary } from '@mui/joy'
import type React from 'react'
import { useEffect, useState } from 'react'
import { type Icon, UseIcon } from '@/lib'

export interface AccordionCardProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  expanded?: boolean
  icon?: Icon
  iconNode?: React.ReactNode
  width?: string | number
}

export const AccordionCard: React.FC<AccordionCardProps> = ({
  title,
  children,
  icon: Icon,
  iconNode,
  width,
  defaultExpanded,
  expanded: expandedProp,
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
    <Accordion
      variant="outlined"
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
    >
      <AccordionSummary variant="soft">
        <span
          style={{
            alignItems: 'center',
            display: 'inline-flex',
            gap: 6,
          }}
        >
          {Icon && <UseIcon icon={Icon} small />}
          {iconNode}
          <span>{title}</span>
        </span>
      </AccordionSummary>
      <AccordionDetails
        slotProps={{ content: { sx: { overflow: 'auto', width, p: 1 } } }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  )
}
