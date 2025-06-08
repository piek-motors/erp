import { Icon, UilPen, UilTrashAlt } from '@iconscout/react-unicons'
import {
  Box,
  Button,
  ButtonProps,
  ChipProps,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputProps,
  Chip as MuiChip,
  Stack,
  StackProps,
  Textarea,
  TextareaProps,
  Typography,
  TypographyProps
} from '@mui/joy'
import React, { JSX } from 'react'
import { useNavigate } from 'react-router-dom'

export const Btn = Button
export const P = (props: TypographyProps) => <Typography {...props} />
export const Label = (props: TypographyProps & { label?: string }) =>
  Boolean(props.label || props.children) && (
    <Typography {...props} level="body-sm" sx={{ p: 0, m: 0 }}>
      {props.label || props.children}
    </Typography>
  )

type MyInputProps = {
  label?: string
  helperText?: string
  value?: string | number | null
  onChange?: (value: string) => void
  customInput?: React.ComponentType<any>
  unit?: string
  enableAutoComplete?: boolean
  name?: string
  type?: InputProps['type']
  placeholder?: string
  fullWidth?: boolean
  autoFocus?: boolean
}

export function Inp(props: MyInputProps) {
  return (
    <FormControl>
      <Label label={props.label} />
      {props.customInput ? (
        <props.customInput onChange={props.onChange} name={props.name} />
      ) : (
        <Row>
          <Input
            {...props}
            value={props.value?.toString() || ''}
            autoComplete={props.enableAutoComplete ? 'on' : 'off'}
            onChange={e => {
              const value = e.target.value ?? ''
              props.onChange?.(value)
            }}
          />
          {props.unit && <P>{props.unit}</P>}
        </Row>
      )}
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  )
}

export function Row(props: { children: React.ReactNode } & StackProps) {
  return <Stack direction="row" gap={1} alignItems="center" {...props} />
}

export function RowButColumsAtSm(
  props: {
    children: React.ReactNode
  } & StackProps
) {
  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{ display: { xs: 'none', md: 'flex' } }}
      {...props}
    />
  )
}

export function CancelButton(props: { onClick: () => void }) {
  return (
    <Btn variant="plain" color="neutral" onClick={props.onClick}>
      Отменить
    </Btn>
  )
}

export function DeleteResourceButton(props: { onClick: () => void }) {
  return (
    <IconButton variant="soft" color="danger" onClick={props.onClick} size="sm">
      <UseIcon icon={UilTrashAlt} />
    </IconButton>
  )
}

export function UpdateResourceButton(props: { onClick: () => void }) {
  return (
    <IconButton
      variant="soft"
      color="primary"
      onClick={props.onClick}
      size="sm"
    >
      <UseIcon icon={UilPen} />
    </IconButton>
  )
}

export function AddResourceButton(props: {
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
      <Label label={props.label} />
      <Textarea placeholder={props.label} {...props} />
    </FormControl>
  )
}

export function SavedHint(props: { show: any }) {
  return props.show && <P color="success">Сохранено</P>
}

export function ErrorHint(props: { e?: Error | any }) {
  return (
    props.e && (
      <Box>
        <P color="danger">{props.e['message']}</P>
        <P color="danger">{JSON.stringify(props.e)}</P>
      </Box>
    )
  )
}

export function LoadingHint(props: { show: boolean }) {
  return (
    props.show && (
      <Row p={2} gap={1}>
        <P>Загрузка...</P>
        <CircularProgress size="sm" color="neutral" />
      </Row>
    )
  )
}

export function TakeLookHint(props: { text: string; link: string }) {
  const navigate = useNavigate()

  return (
    <Stack direction={'row'} alignItems={'center'} gap={2} pt={2}>
      <P
        sx={{
          p: 0
        }}
      >
        {props.text}
      </P>
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
  buttonProps?: ButtonProps
  stackProps?: StackProps
}) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error>()
  const [mutationResult, setMutationResult] = React.useState<unknown>()

  const handleSubmit = async () => {
    setLoading(true)
    setError(undefined)
    setMutationResult(undefined)

    try {
      const result = await props.onClick()
      setMutationResult(result)
    } catch (e: any) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }
  return (
    <Stack gap={1} {...props.stackProps}>
      <ErrorHint e={error} />
      <SavedHint show={mutationResult} />
      <Button
        onClick={async () => handleSubmit()}
        disabled={loading}
        {...props.buttonProps}
      >
        {props.title ?? 'Сохранить'}
      </Button>
      {(mutationResult || error) && props.additionals?.(error, mutationResult)}
    </Stack>
  )
}

export function Pre(props: { children: React.ReactNode }) {
  return (
    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{props.children}</pre>
  )
}

export const bgcolors = {
  lightgrey: '#d5cccc53',
  blue: '#8cb8e753'
}

export const text = {
  showMore: 'Показать еще',
  delete: 'Удалить',
  loading: 'Загрузка...',
  moveToPriority: 'Принять заказ в производство',
  uploadFile: 'Загрузить файл',
  orderDetails: 'Детали заказа',
  orderReadyForDispatch: 'Готов к отгрузке',
  orderRequiresSpectialAttention: 'Требует внимания',
  change: 'Изменить',
  addPosition: 'Добавить позицию',
  orderCompleted: 'Заказ был выполнен'
}

export const IconSettings = {
  opacity: 0.6,
  width: 22,
  fill: 'black'
}

export function UseIcon(props: { icon: Icon; small?: boolean }) {
  return (
    <props.icon
      width={props.small ? IconSettings.width / 1.5 : IconSettings.width}
      opacity={IconSettings.opacity}
      fill={IconSettings.fill}
    />
  )
}

export function Chip(props: {
  if: boolean
  text: string
  chipProps: ChipProps
}) {
  if (!props.if) return null
  return (
    <MuiChip color="success" variant="outlined" size="sm" {...props.chipProps}>
      {props.text}
    </MuiChip>
  )
}
