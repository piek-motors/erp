/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

type Display = 'flex' | 'block' | 'inline-block' | 'inline' | 'none'

export function PrintOnly({
  children,
  display = 'flex' as Display
}: {
  children: React.ReactNode
  display?: Display
}) {
  return (
    <div
      css={css`
        display: none !important;
        @media print {
          display: ${display} !important;
        }
      `}
    >
      {children}
    </div>
  )
}

export function WebOnly({
  children,
  display = 'flex' as Display
}: {
  children: React.ReactNode
  display?: Display
}) {
  return (
    <div
      css={css`
        display: ${display} !important;
        @media print {
          display: none !important;
        }
      `}
    >
      {children}
    </div>
  )
}

export type Layout = typeof PrintOnly | typeof WebOnly
