import { Accordion, AccordionDetails, AccordionSummary } from '@mui/joy'
import type React from 'react'
import { useEffect, useState } from 'react'

export interface AccordionCardProps {
	title: React.ReactNode
	children: React.ReactNode
	defaultExpanded?: boolean
	expanded?: boolean
	width?: string | number
}

export const AccordionCard: React.FC<AccordionCardProps> = ({
	title,
	children,
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
			<AccordionSummary>{title}</AccordionSummary>
			<AccordionDetails
				slotProps={{ content: { sx: { overflow: 'auto', width } } }}
			>
				{children}
			</AccordionDetails>
		</Accordion>
	)
}
