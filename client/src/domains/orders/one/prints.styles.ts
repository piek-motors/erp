/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

export const orderInfoPrintStyle = css`
  @media print {
    * {
      font-size: 0.6rem !important;
      width: max-content;
    }
  }
`

export const orderPositionsItemStyle = css`
  @media print {
    * {
      font-size: 1.6rem !important;
      width: max-content;
    }
  }
`
