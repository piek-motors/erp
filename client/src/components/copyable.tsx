/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { Box, type BoxProps } from '@mui/joy'
import type { ReactNode } from 'react'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

const copyableStyle = (copied: boolean) => css`
  border-radius: 4px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.18);
  cursor: copy;
  padding-bottom: 4px;
  transition:
    background-color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    background-color: rgba(25, 118, 210, 0.04);
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  ${
    copied &&
    css`
      animation: copyable-copied 450ms ease-out;
      background-color: rgba(25, 118, 210, 0.08);
      box-shadow: inset 0 0 0 1px rgba(25, 118, 210, 0.12);
    `
  }

  @keyframes copyable-copied {
    0% {
      background-color: rgba(25, 118, 210, 0.12);
      box-shadow: inset 0 0 0 1px rgba(25, 118, 210, 0.16);
    }
    100% {
      background-color: rgba(25, 118, 210, 0.03);
      box-shadow: inset 0 0 0 1px rgba(25, 118, 210, 0);
    }
  }
`

interface CopyableProps extends Omit<BoxProps, 'children'> {
  children: ReactNode
  copyKey?: string | number
  text: string
}

export function Copyable({ children, copyKey, text, ...props }: CopyableProps) {
  const key = copyKey ?? text
  const { copy, isCopied } = useCopyToClipboard<string | number>()

  async function copyText() {
    await copy(text, key)
  }

  return (
    <Box
      {...props}
      onClick={event => {
        props.onClick?.(event)
        if (!event.defaultPrevented) {
          void copyText()
        }
      }}
      onKeyDown={event => {
        props.onKeyDown?.(event)
        if (event.defaultPrevented) return

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          void copyText()
        }
      }}
      role={props.role ?? 'button'}
      tabIndex={props.tabIndex ?? 0}
      css={copyableStyle(isCopied(key))}
    >
      {children}
    </Box>
  )
}
