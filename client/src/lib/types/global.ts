import { JSX } from 'react'
import {
  CommentsSubscription,
  GetAllUsersQuery,
  GetNotificationsSubscription,
  GetOrderByPkQuery,
  GetReclamationOrdersQuery,
  OrderFragment
} from './graphql-shema'

export type ServerErrorResponse = {
  error: {
    message: string
    code: number
  }
}

export type PreparedEmployeeDto = {
  id: number
  firstname: string
  lastname: string
  card: string

  intervals: Partial<{
    ent: string | null
    ext: string | null
    // the time between first entrance and last exit without gaps
    dur: number | null

    /**
     * -seconds
     * Суммарная длительность интервалов с учетом обеда, даже если человек отлучился во время работы в течении дня
     */
    durWithRetention_sec: number | null
    durWithRetention_human: string | null

    resolved: boolean | null
  }>[]

  /**
   *  - seconds
   * Чистое суммарное рабочее время c учетом обедов, но без поправок. Так сказать по факту
   */
  monthlyWithRetention: number

  /**
   *  - seconds
   *  Суммарное рабочее время за месяц с поправками на пустые интервалы
   *  т.е. Если сотрудник забыл отметиться при выходе, то рабочая смена будет считаться не законченной,
   *  и установится какое-то константное значение (4 часа)
   */
  monthlyWithRetentionResolved: number
}

export type AppColorTheme = 'light' | 'dark' | 'system'
export type AppColorMode = 'light' | 'dark'

export type TOrderItem =
  GetOrderByPkQuery['orders_orders'][number]['order_items'][number]
export type TReclamationOrder =
  GetReclamationOrdersQuery['orders_orders'][number]

export type TOrder = GetOrderByPkQuery['orders_orders'][number]
export type TOrderColumnData = OrderFragment

export type TPaymentsHistory =
  GetOrderByPkQuery['orders_orders'][number]['order_payments'][number]
export type TComment = CommentsSubscription['orders_comments'][number]
export type TUser = GetAllUsersQuery['users'][number]
export type TNotification =
  GetNotificationsSubscription['orders_notifications'][number]

export interface RouteConfig {
  path: string
  element: JSX.Element
}
