import { UilSearch } from '@iconscout/react-unicons'
import { Input, type InputProps } from '@mui/joy'
import type React from 'react'
import { Row, UseIcon } from '@/lib'

interface ISearchInputWithFiltersProps {
  value?: string
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
        value={props.value}
        sx={{
          width: props.width,
          maxWidth: props.maxWidth,
          ...props.sx,
          boxShadow: 'none',
        }}
        startDecorator={<UseIcon icon={UilSearch} small {...props} />}
        {...props}
      />
      {props.children}
    </Row>
  )
}
