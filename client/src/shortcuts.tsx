import { UilTrash } from '@iconscout/react-unicons'
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputProps,
  Stack,
  StackProps,
  Textarea,
  TextareaProps
} from '@mui/joy'
import React from 'react'

export const Btn = Button

type MyInputProps = InputProps & {
  label?: string
  helperText?: string
  default?: string | null
  customInput?: React.ComponentType<any>
}

export function MyInput(props: MyInputProps) {
  return (
    <FormControl>
      {props.label && <FormLabel>{props.label}</FormLabel>}
      {props.customInput ? (
        <props.customInput
          onChange={props.onChange}
          defaultValue={props.default || ''}
          name={props.name}
        />
      ) : (
        <Input {...props} defaultValue={props.default || ''} />
      )}
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  )
}

export function Row(props: { children: React.ReactNode } & StackProps) {
  return <Stack direction="row" gap={1} alignItems="center" {...props} />
}

export function CancelButton(props: { onClick: () => void }) {
  return (
    <Btn variant="plain" color="neutral" onClick={props.onClick}>
      Отменить
    </Btn>
  )
}

export function DeteleButton(props: { onClick: () => void }) {
  return (
    <IconButton variant="plain" color="danger" onClick={props.onClick}>
      <UilTrash />
    </IconButton>
  )
}

export function InputStack(props: { children: React.ReactNode }) {
  return (
    <Stack direction="column" gap={1} my={1}>
      {props.children}
    </Stack>
  )
}

export function MultilineInput(
  props: {
    label?: string
  } & TextareaProps
) {
  return (
    <FormControl>
      {<FormLabel>{props.label}</FormLabel>}
      <Textarea placeholder={props.label} {...props} />
    </FormControl>
  )
}
