import { UilSearch } from '@iconscout/react-unicons'
import { Input } from '@mui/joy'
import React, { ReactNode } from 'react'
import { Row } from '../shortcuts'

interface ISearchInputWithFiltersProps {
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  children?: ReactNode
}

export function Search({
  value,
  onChange,
  placeholder,
  children
}: ISearchInputWithFiltersProps) {
  return (
    <Row gap={1}>
      <UilSearch />
      <Input
        type="text"
        placeholder={placeholder}
        autoFocus={value !== ''}
        onChange={onChange}
        value={value}
      />
      {children}
    </Row>
  )
}
