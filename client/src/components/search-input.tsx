import { UilSearch } from '@iconscout/react-unicons'
import { Input } from '@mui/joy'
import React, { ReactNode } from 'react'
import { Row, UseIcon } from '../shortcuts'

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
    <Row gap={1} sx={{ position: 'sticky', px: 1 }}>
      <Input
        size="sm"
        type="text"
        variant="soft"
        placeholder={placeholder || 'Найти'}
        autoFocus={value !== ''}
        onChange={onChange}
        value={value}
        startDecorator={<UseIcon icon={UilSearch} small />}
      />
      {children}
    </Row>
  )
}
