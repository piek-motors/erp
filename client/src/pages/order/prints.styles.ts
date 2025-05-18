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

export const orderPositionsStyle = css`
  @media print {
    width: 100%;
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
