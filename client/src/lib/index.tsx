/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  Icon,
  UilLink,
  UilMinus,
  UilPen,
  UilPlusCircle,
  UilSave,
  UilTrashAlt
} from '@iconscout/react-unicons'
import {
  Box,
  Button,
  ButtonProps,
  Checkbox,
  ChipProps,
  Container,
  FormControl,
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
  Tooltip,
  Typography,
  TypographyProps
} from '@mui/joy'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link as ReactLink, useNavigate } from 'react-router'
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
export const Label = (
  props: TypographyProps & { label?: string; xs?: boolean }
) => {
  const level = props.xs ? 'body-xs' : 'body-sm'
  return (
    Boolean(props.label || props.children) && (
      <Typography level={level} {...props}>
        {props.label || props.children}
      </Typography>
    )
  )
}

export type InputLabledProps = {
  label?: string
  value?: string | number | null
  onChange?: (value: string) => void
  fullWidth?: boolean
} & Omit<InputProps, 'value' | 'onChange'>

export const InputLabled = (props: InputLabledProps) => (
  <FormControl
    sx={{ width: props.fullWidth ? '-webkit-fill-available' : 'auto' }}
  >
    <Label label={props.label} />
    <Row>
      <Input
        {...props}
        value={props.value?.toString() || ''}
        autoComplete={'off'}
        onChange={e => {
          const value = e.target.value ?? ''
          props.onChange?.(value)
        }}
      />
    </Row>
  </FormControl>
)

export function InputWithUnit(
  props: InputProps & { unit?: string; label?: string }
) {
  return (
    <FormControl
      sx={{ width: props.fullWidth ? '-webkit-fill-available' : 'auto' }}
    >
      <Label label={props.label} />
      <Input autoComplete={'off'} {...props} endDecorator={props.unit} />
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
    <ReactLink
      to={props.to}
      css={style}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      {props.children}
    </ReactLink>
  )
}

export function RowButColumsAtSm(
  props: {
    children: React.ReactNode
  } & StackProps
) {
  return <Stack gap={0.5} direction={{ xs: 'column', md: 'row' }} {...props} />
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

export const UpdateResourceButton = (props: { onClick: () => void }) => (
  <IconButton variant="soft" color="primary" onClick={props.onClick} size="sm">
    <UseIcon icon={UilPen} />
  </IconButton>
)

export const AddResourceButton = (props: {
  onClick?: () => void
  navigateTo?: string
}) => {
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

export const MinusIcon = (props: IconButtonProps) => (
  <IconButton
    variant="soft"
    color="danger"
    {...props}
    size="sm"
    sx={{ width: 'min-content', ...props.sx }}
  >
    <UseIcon icon={UilMinus} />
  </IconButton>
)

export const PlusIcon = (props: IconButtonProps) => (
  <IconButton
    variant="soft"
    color="primary"
    {...props}
    size="sm"
    sx={{ width: 'min-content', ...props.sx }}
  >
    <UseIcon icon={UilPlusCircle} />
  </IconButton>
)

export function InputStack(props: { children: React.ReactNode; p?: number }) {
  return (
    <Stack display="flex" direction="column" gap={0.3} my={1}>
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
      <Textarea {...props} />
    </FormControl>
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
    <Btn
      onClick={() => navigate(props.link)}
      variant="solid"
      sx={{ width: 'fit-content' }}
      color="neutral"
      startDecorator={<UseIcon icon={UilLink} invert small />}
    >
      {props.text}
    </Btn>
  )
}

export const ActionButton = observer(
  (props: {
    disabled?: boolean
    onClick: () => Promise<any>
    label?: string
    props?: ButtonProps
    fullWidth?: boolean
  }) => {
    const [loading, setLoading] = React.useState(false)
    const handleSubmit = async () => {
      setLoading(true)
      try {
        await props.onClick()
      } finally {
        setLoading(false)
      }
    }
    return (
      <Button
        fullWidth={props.fullWidth}
        onClick={handleSubmit}
        disabled={props.disabled}
        loading={loading}
        {...props.props}
        sx={{ width: 'fit-content', ...props.props?.sx }}
      >
        {props.label ?? 'Сохранить'}
      </Button>
    )
  }
)

export function Pre(props: { children: React.ReactNode }) {
  return <pre style={{ whiteSpace: 'nowrap', margin: 0 }}>{props.children}</pre>
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

const IconSettings = {
  opacity: 0.6,
  width: 22,
  fill: 'black'
} as const

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

export const SaveIconButton = (props: IconButtonProps) => (
  <Tooltip title="Сохранить">
    <IconButton
      variant="solid"
      color="primary"
      {...props}
      sx={{ width: 'min-content', ...props.sx }}
    >
      <UseIcon
        icon={UilSave}
        invert={props.variant === 'solid' || !props.variant}
      />
    </IconButton>
  </Tooltip>
)

export const TooltipIconButton = (props: {
  icon: Icon
  tooltip?: string
  variant?: IconButtonProps['variant']
  color?: IconButtonProps['color']
  onClick: () => void
}) => (
  <Tooltip title={props.tooltip}>
    <IconButton
      size="sm"
      variant={props.variant}
      color={props.color}
      onClick={props.onClick}
    >
      <UseIcon icon={props.icon} invert={props.variant === 'solid'} />
    </IconButton>
  </Tooltip>
)
