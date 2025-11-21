import { UilSearch } from '@iconscout/react-unicons'
import { Input, InputProps } from '@mui/joy'
import { Row, UseIcon } from 'lib'
import React from 'react'

interface ISearchInputWithFiltersProps {
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  width?: string | number
  maxWidth?: string | number
  children?: React.ReactNode
}

export function Search(props: ISearchInputWithFiltersProps & InputProps) {
  return (
    <Row>
      <Input
        size="sm"
        type="text"
        placeholder={props.placeholder || 'Найти'}
        autoFocus={props.value !== ''}
        onChange={props.onChange}
        value={props.value}
        sx={{ width: props.width, maxWidth: props.maxWidth, ...props.sx }}
        startDecorator={<UseIcon icon={UilSearch} small {...props} />}
      />
      {props.children}
    </Row>
  )
}
