import { UilSearch } from '@iconscout/react-unicons'
import { Box, Input } from '@mui/joy'
import React, { ReactNode } from 'react'
import { Row } from '../shortcuts'

interface ISearchInputWithFiltersProps {
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  children?: ReactNode
}

export function Search({
  value,
  onChange,
  placeholder,
  children
}: ISearchInputWithFiltersProps) {
  return (
    <Row gap={1} sx={{ position: 'sticky' }}>
      <Box sx={{ opacity: 0.5 }}>
        <UilSearch width={20} />
      </Box>
      <Input
        type="text"
        variant="soft"
        placeholder={placeholder || 'Найти'}
        autoFocus={value !== ''}
        onChange={onChange}
        value={value}
      />
      {children}
    </Row>
  )
}
