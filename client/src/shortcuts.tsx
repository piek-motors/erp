import { UilPen, UilTrash } from '@iconscout/react-unicons'
import {
  Box,
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
  TextareaProps,
  Typography
} from '@mui/joy'
import React from 'react'

export const Btn = Button

type MyInputProps = InputProps & {
  label?: string
  helperText?: string
  default?: string | null
  customInput?: React.ComponentType<any>
  unit?: string
}

export function MyInput(props: MyInputProps) {
  return (
    <FormControl>
      {props.label && <FormLabel sx={{ margin: 0 }}>{props.label}</FormLabel>}
      {props.customInput ? (
        <props.customInput
          onChange={props.onChange}
          defaultValue={props.default || ''}
          name={props.name}
        />
      ) : (
        <Row>
          <Input {...props} defaultValue={props.default || ''} />
          {props.unit && <Typography>{props.unit}</Typography>}
        </Row>
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

export function EditButton(props: { onClick: () => void }) {
  return (
    <IconButton variant="plain" color="primary" onClick={props.onClick}>
      <UilPen />
    </IconButton>
  )
}

export function AddButton(props: {
  onClick?: () => void
  navigateTo?: string
}) {
  const navigate = useNavigate()

  return (
    <Button
      variant="soft"
      color="primary"
      onClick={
        props.onClick
          ? props.onClick
          : () => {
              if (props.navigateTo) {
                navigate(props.navigateTo)
              }
            }
      }
    >
      Добавить
    </Button>
  )
}

export function InputStack(props: { children: React.ReactNode }) {
  return (
    <Stack display="flex" direction="column" gap={1} my={1}>
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

import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export function MyTabs(props: {
  tabs: Record<string, ReactNode>
  handleChange?: (newVal: any) => void
}) {
  return (
    <Tabs>
      <TabList>
        {Object.keys(props.tabs).map((each, idx) => (
          <Tab key={each}>{each}</Tab>
        ))}
      </TabList>
      {Object.values(props.tabs).map((component, idx) => (
        <TabPanel key={idx} value={idx}>
          {component}
        </TabPanel>
      ))}
    </Tabs>
  )
}

export function SavedHint(props: { show: any }) {
  return props.show && <Typography color="success">Сохранено</Typography>
}

export function ErrorHint(props: { e?: Error | any }) {
  return (
    props.e && (
      <Box>
        <Typography color="danger">{props.e['message']}</Typography>
        <Typography color="danger">{JSON.stringify(props.e)}</Typography>
      </Box>
    )
  )
}

export function LoadingHint(props: { show: boolean }) {
  return props.show && <Typography>Загрузка...</Typography>
}

export function TakeLookHint(props: { text: string; link: string }) {
  const navigate = useNavigate()

  return (
    <Stack direction={'row'} alignItems={'center'} gap={2} pt={2}>
      <Typography
        sx={{
          p: 0
        }}
      >
        {props.text}
      </Typography>
      <Btn
        onClick={() => navigate(props.link)}
        variant="outlined"
        color="success"
      >
        "Посмотреть"
      </Btn>
    </Stack>
  )
}

export function SendMutation(props: {
  onClick: () => Promise<any>
  title?: string
  additionals?: (error?: Error, mutationResult?: any) => JSX.Element
}) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error>()
  const [mutationResult, setMutationResult] = React.useState<unknown>()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await props.onClick()
      setMutationResult(result)
    } catch (e: any) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Stack gap={1}>
      <ErrorHint e={error} />
      <SavedHint show={mutationResult} />
      <Button onClick={async () => handleSubmit()} disabled={loading}>
        {props.title ?? 'Сохранить'}
      </Button>
      {(mutationResult || error) && props.additionals?.(error, mutationResult)}
    </Stack>
  )
}
