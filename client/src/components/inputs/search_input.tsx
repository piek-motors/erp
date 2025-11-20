import { UilSearch } from '@iconscout/react-unicons'
import { Input, InputProps } from '@mui/joy'
import { UseIcon } from 'lib'
import React from 'react'

interface ISearchInputWithFiltersProps {
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  width?: string | number
}

export function Search(props: ISearchInputWithFiltersProps & InputProps) {
  return (
    <Input
      size="sm"
      type="text"
      placeholder={props.placeholder || 'Найти'}
      autoFocus={props.value !== ''}
      onChange={props.onChange}
      value={props.value}
      sx={{ width: props.width, ...props.sx }}
      startDecorator={<UseIcon icon={UilSearch} small {...props} />}
    />
  )
}
