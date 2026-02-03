import type { JSX } from 'react'

export type ServerErrorResponse = {
  error: {
    message: string
    code: number
  }
}

export interface RouteConfig {
  path: string
  element: JSX.Element
}
