/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Button } from '@mui/material'

export function CreateRecordButton({
  onClick,
  text
}: {
  onClick(): void
  text?: string
}) {
  return (
    <Button
      css={css`
        margin: 6px 0;
      `}
      variant="contained"
      onClick={onClick}
    >
      {text || '+ Запись'}
    </Button>
  )
}
