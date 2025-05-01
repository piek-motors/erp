import type { NextFunction, Request, Response } from 'express'
import OrderService from '../repositories/order-stat.repository.ts'

class _OrderController {
  // Return array of unpaid orders ids.
  async getUnpaidOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await OrderService.getUnpaidOrders()

      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

export const OrderController = new _OrderController()
