/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  Icon,
  UilLink,
  UilPen,
  UilPlusCircle,
  UilTrashAlt
} from '@iconscout/react-unicons'
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Checkbox,
  ChipProps,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  IconButtonProps,
  Input,
  InputProps,
  LinearProgress,
  Chip as MuiChip,
  Sheet,
  Stack,
  StackProps,
  Textarea,
  TextareaProps,
  ToggleButtonGroup,
  Typography,
  TypographyProps
} from '@mui/joy'
import { useIsDesktop, useIsMobile } from 'hooks/use-media-query'
import { observer } from 'mobx-react-lite'
import React, { JSX } from 'react'
import { Link as ReactLink, useNavigate } from 'react-router'
import { notifier } from './store/notifier.store'
export { observer, Observer } from 'mobx-react-lite'
export { useCallback, useEffect, useMemo, useState } from 'react'
export { useLocation, useNavigate, useParams } from 'react-router'
export { openPage, routeMap } from './routes'
export {
  Box,
  Button,
  Checkbox,
  Container,
  Input,
  Sheet,
  Stack,
  Textarea,
  ToggleButtonGroup
}
export const Btn = Button
export const P = (props: TypographyProps) => <Typography {...props} />
export const Label = (props: TypographyProps & { label?: string }) =>
  Boolean(props.label || props.children) && (
    <Typography level="body-sm" sx={{ p: 0, m: 0 }} {...props}>
      {props.label || props.children}
    </Typography>
  )

export type MyInputProps = {
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
  sx?: InputProps['sx']
  size?: InputProps['size']
  variant?: InputProps['variant']
  color?: InputProps['color']
}

export function Inp(props: MyInputProps) {
  return (
    <FormControl
      sx={{ width: props.fullWidth ? '-webkit-fill-available' : 'auto' }}
    >
      <Label label={props.label} />
      {props.customInput ? (
        <props.customInput onChange={props.onChange} name={props.name} />
      ) : (
        <Row>
          <Input
            {...props}
            color={props.color}
            value={props.value?.toString() || ''}
            autoComplete={props.enableAutoComplete ? 'on' : 'off'}
            onChange={e => {
              const value = e.target.value ?? ''
              props.onChange?.(value)
            }}
            size={props.size}
            sx={props.sx}
            variant={props.variant}
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

export function Link(props: { to: string; children: React.ReactNode }) {
  const style = css`
    text-decoration: none;
    color: inherit;
    &:hover {
      text-decoration: underline;
    }
  `
  return (
    <ReactLink to={props.to} css={style}>
      {props.children}
    </ReactLink>
  )
}

export function RowButColumsAtSm(
  props: {
    children: React.ReactNode
  } & StackProps
) {
  return <Stack gap={1} direction={{ xs: 'column', md: 'row' }} {...props} />
}

export function StackButRowAtSm(
  props: {
    children: React.ReactNode
  } & StackProps
) {
  return (
    <Stack
      gap={1}
      direction={{ xs: 'row', md: 'column' }}
      sx={{ flexWrap: 'wrap' }}
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

export function DeleteResourceButton(props: {
  variant?: IconButtonProps['variant']
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  small?: boolean
}) {
  return (
    <IconButton
      variant={props.variant ?? 'soft'}
      color="danger"
      onClick={props.onClick}
      size="sm"
    >
      <UseIcon icon={UilTrashAlt} small={props.small} />
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
      variant="solid"
      size="sm"
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

export function PlusIcon(props: IconButtonProps) {
  return (
    <IconButton variant="soft" color="primary" {...props} size="sm">
      <UseIcon icon={UilPlusCircle} />
    </IconButton>
  )
}

export function InputStack(props: { children: React.ReactNode }) {
  return (
    <Sheet sx={{ borderRadius: 'sm' }}>
      <Stack display="flex" direction="column" gap={0.3} my={1}>
        {props.children}
      </Stack>
    </Sheet>
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
      <Textarea {...props} />
    </FormControl>
  )
}

export function SavedHint(props: { data: any }) {
  return (
    props.data && (
      <P color="success" level="body-sm">
        Сохранено
      </P>
    )
  )
}

export const ErrorText = (props: { e?: Error | any }) => (
  <P color="danger" level="body-sm" fontFamily={'monospace'}>
    {props.e['message'] || props.e}
  </P>
)

export function ErrorHint(props: { e?: Error | any }) {
  if (props.e) {
    console.error(props.e)
  }
  return (
    props.e && (
      <Box>
        <P color="danger">{props.e['message']}</P>
      </Box>
    )
  )
}

/**@deprecated use LinearProgress instead */
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

export function Loading() {
  return (
    <Box sx={{ minWidth: '-webkit-fill-available' }}>
      <LinearProgress size="sm" color="danger" />
    </Box>
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
        startDecorator={<UseIcon icon={UilLink} small />}
      >
        Посмотреть
      </Btn>
    </Stack>
  )
}

export const ExecuteAction = observer(
  (props: {
    disabled?: boolean
    onSubmit: () => Promise<any>
    buttonLabel?: string
    additionals?: (error?: Error, mutationResult?: any) => JSX.Element | null
    buttonProps?: ButtonProps
    stackProps?: StackProps
    fullWidth?: boolean
    width?: string
  }) => {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<Error>()
    const [mutationResult, setMutationResult] = React.useState<any>()

    const handleSubmit = async () => {
      setLoading(true)
      setError(undefined)
      setMutationResult(undefined)
      try {
        const result = await props.onSubmit()
        setMutationResult(result)
      } catch (e: any) {
        notifier.notify('err', e.message || e)
        setError(e.message || e)
      } finally {
        setLoading(false)
      }
    }
    return (
      <Stack
        gap={1}
        {...props.stackProps}
        sx={{ width: props.fullWidth ? '100%' : props.width || 'auto' }}
      >
        {error && <ErrorText e={error} />}
        <SavedHint data={mutationResult} />
        <Button
          fullWidth={props.fullWidth}
          onClick={async () => handleSubmit()}
          disabled={props.disabled}
          loading={loading}
          {...props.buttonProps}
        >
          {props.buttonLabel ?? 'Сохранить'}
        </Button>
        {(mutationResult || error) &&
          props.additionals?.(error, mutationResult)}
      </Stack>
    )
  }
)

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

export function UseIcon(props: {
  icon: Icon
  small?: boolean
  invert?: boolean
}) {
  const fillColor = props.invert ? 'white' : IconSettings.fill

  return (
    <props.icon
      width={props.small ? IconSettings.width / 1.5 : IconSettings.width}
      opacity={IconSettings.opacity}
      fill={fillColor}
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

// create function to show content only on mobile and hide on desktop
export function MobileOnly(props: {
  children: React.ReactNode
  sx?: BoxProps['sx']
}) {
  const isMobile = useIsMobile()
  if (!isMobile) {
    return null
  }
  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' }, ...props.sx }}>
      {props.children}
    </Box>
  )
}

// create function to show content only on desktop and hide on mobile
export function DesktopOnly(props: {
  children: React.ReactNode
  sx?: BoxProps['sx']
}) {
  const isDesktop = useIsDesktop()
  if (!isDesktop) {
    return null
  }
  return (
    <Box sx={{ display: { xs: 'none', sm: 'block' }, ...props.sx }}>
      {props.children}
    </Box>
  )
}
