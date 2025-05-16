import { UilPen, UilTrash } from '@iconscout/react-unicons'
import {
  Box,
  Button,
  ChipProps,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputProps,
  Chip as MuiChip,
  Stack,
  StackProps,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  TextareaProps,
  Typography
} from '@mui/joy'
import React, { JSX, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

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
        <props.customInput onChange={props.onChange} name={props.name} />
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
      <UilTrash width={ICON_WIDTH} opacity={ICON_OPACITY} fill="red" />
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
      <UilPen width={ICON_WIDTH} opacity={ICON_OPACITY} />
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
      {<FormLabel>{props.label}</FormLabel>}
      <Textarea placeholder={props.label} {...props} />
    </FormControl>
  )
}

export function MyTabs(props: {
  tabs: Record<string, ReactNode>
  handleChange?: (newVal: any) => void
  value?: string
}) {
  return (
    <Tabs
      value={props.value}
      onChange={(e, v) => {
        if (v == null) return
        if (props.handleChange) {
          props.handleChange(Object.values(props.tabs)[v])
        }
      }}
    >
      <TabList>
        {Object.entries(props.tabs).map(([key, value], idx) => (
          <Tab
            key={key}
            color={props.value == value ? 'primary' : 'neutral'}
            variant={props.value == value ? 'soft' : 'plain'}
          >
            {key}
          </Tab>
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
  return (
    props.show && (
      <Row p={2} gap={1}>
        <Typography>Загрузка...</Typography>
        <CircularProgress size="sm" color="neutral" />
      </Row>
    )
  )
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

export const ICON_OPACITY = 0.7
export const ICON_WIDTH = 22

export function MyChip(props: { if: boolean; text: string } & ChipProps) {
  if (!props.if) return null
  return (
    <MuiChip color="success" variant="outlined" size="sm" {...props}>
      {props.text}
    </MuiChip>
  )
}

