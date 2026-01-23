import type { UnpackedOrder } from 'domains/orders/api'
import { rpc } from 'lib/deps'
import { makeAutoObservable } from 'mobx'
import { Payment } from 'models'
import moment from 'moment'

export class PaymentStore {
	modalOpen = false
	orderId: number | null = null
	date: string | null = null
	amount: number | null = null
	payments: Payment[] = []
	loading = false
	error: Error | null = null

	constructor() {
		makeAutoObservable(this)
	}

	init(orderId: number) {
		this.orderId = orderId
		this.setDate(moment().local().format('DD.MM.YY'))
	}

	setDate(date: string | null) {
		this.date = date
	}
	setAmount(amount: number | null) {
		this.amount = amount
	}
	setLoading(loading: boolean) {
		this.loading = loading
	}
	setError(error: Error | null) {
		this.error = error
	}
	setPayments(payments: Payment[]) {
		this.payments = payments
	}
	openModal() {
		this.modalOpen = true
		this.date = moment().local().format('DD.MM.YY')
	}
	closeModal() {
		this.modalOpen = false
		this.amount = null
	}
	clear() {
		this.orderId = null
		this.date = null
		this.amount = null
		this.error = null
	}

	async insertPayment(order: UnpackedOrder) {
		this.assertOrderId()

		return this.withStateManagement(async () => {
			if (!this.date || !this.amount) {
				throw Error('Invalid input: date, and amount are required')
			}

			if (order.total_amount && this.amount > order.total_amount) {
				throw Error('Amount is greater than total amount')
			}

			const date = moment(this.date, 'DD.MM.YY').utc(true)
			if (!date.isValid()) {
				throw Error('Invalid date format')
			}

			const { id } = await rpc.orders.payments.insert.mutate({
				order_id: this.orderId,
				date: date.valueOf(),
				amount: Number(this.amount),
			})

			this.setPayments([
				...this.payments,
				new Payment({
					id,
					amount: this.amount,
					date: date.toDate(),
				}),
			])

			this.closeModal()
			return id
		})
	}

	async deletePayment(paymentId: number) {
		return this.withStateManagement(async () => {
			await rpc.orders.payments.delete.mutate({ id: paymentId })
			this.setPayments(this.payments.filter(p => p.id !== paymentId))
		})
	}

	get totalPaid() {
		return this.payments.reduce((acc, payment) => acc + payment.amount, 0)
	}

	getTotalPaidPercentage(totalAmount: number) {
		if (!totalAmount) return '0%'
		return `${((this.totalPaid / totalAmount) * 100).toFixed(0)}%`
	}

	private assertOrderId(): asserts this is { orderId: number } {
		if (!this.orderId) {
			throw new Error('Order ID is not set')
		}
	}

	private async withStateManagement<T>(fn: () => Promise<T>) {
		this.setLoading(true)
		try {
			return await fn()
		} catch (error) {
			this.setError(error as Error)
			throw error
		} finally {
			this.setLoading(false)
		}
	}
}

export const paymentStore = new PaymentStore()
