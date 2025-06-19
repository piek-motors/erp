import { UilSearch } from '@iconscout/react-unicons'
import { Input } from '@mui/joy'
import { Row, UseIcon } from 'lib'
import React, { ReactNode } from 'react'

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
