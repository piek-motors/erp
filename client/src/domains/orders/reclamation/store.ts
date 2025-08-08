import { apolloClient } from 'lib/api'
import * as gql from 'lib/types/graphql-shema'
import { makeAutoObservable } from 'mobx'
import { Order, OrderStatus } from 'models'
import { map } from '../order.mappers'

export type ColocatedStateKey = 'inbox' | 'decision' | 'inproduction'
type State = Record<ColocatedStateKey, Order[]>

export class ReclamationStore {
  state: State = {
    inbox: [],
    decision: [],
    inproduction: []
  }

  loading = false
  error: Error | null = null

  constructor() {
    makeAutoObservable(this)
  }

  private getOrderStatusByDroppableId(droppableId: ColocatedStateKey): number {
    switch (droppableId) {
      case 'inbox':
        return OrderStatus.ReclamationIncoming
      case 'decision':
        return OrderStatus.ReclamationDecision
      case 'inproduction':
        return OrderStatus.ReclamationInProduction
      default:
        throw Error('droppableId is not valid')
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading
  }

  setError(error: Error | null) {
    this.error = error
  }

  setState(state: State) {
    this.state = state
  }

  private reorder(
    list: Order[],
    startIndex: number,
    endIndex: number
  ): Order[] {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  private move(
    source: Order[],
    destination: Order[],
    droppableSource: { droppableId: ColocatedStateKey; index: number },
    droppableDestination: { droppableId: ColocatedStateKey; index: number }
  ) {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)
    destClone.splice(droppableDestination.index, 0, removed)

    return {
      [droppableSource.droppableId]: sourceClone,
      [droppableDestination.droppableId]: destClone
    }
  }

  async load() {
    this.setLoading(true)
    try {
      const res = await apolloClient.query<
        gql.GetReclamationOrdersQuery,
        gql.GetReclamationOrdersQueryVariables
      >({
        query: gql.GetReclamationOrdersDocument,
        fetchPolicy: 'network-only'
      })

      const orders = (res.data?.orders_orders || []).map(map.order.fromDto)

      this.setState({
        inbox: orders.filter(
          order => order.status === OrderStatus.ReclamationIncoming
        ),
        decision: orders.filter(
          order => order.status === OrderStatus.ReclamationDecision
        ),
        inproduction: orders.filter(
          order => order.status === OrderStatus.ReclamationInProduction
        )
      })
    } catch (error) {
      console.error(error)
      this.setError(error as Error)
    } finally {
      this.setLoading(false)
    }
  }

  async handleDragEnd(
    source: { droppableId: ColocatedStateKey; index: number },
    destination: { droppableId: ColocatedStateKey; index: number } | null,
    draggableId: string
  ) {
    if (!destination) return

    const sInd = source.droppableId
    const dInd = destination.droppableId
    const orderId = parseInt(draggableId)

    try {
      if (source.droppableId === destination.droppableId) {
        // Reordering within the same column
        const items = this.reorder(
          this.state[sInd],
          source.index,
          destination.index
        )
        this.setState({
          ...this.state,
          [sInd]: items
        })
      } else {
        // Moving between columns
        const result = this.move(
          this.state[sInd],
          this.state[dInd],
          source,
          destination
        )

        // Update the order's status
        const newStatus = this.getOrderStatusByDroppableId(dInd)
        const movedOrder = this.state[sInd][source.index]
        movedOrder.status = newStatus

        // Update the state with the new order positions
        this.setState({
          ...this.state,
          [sInd]: result[sInd],
          [dInd]: result[dInd]
        })

        // Update the backend
        await apolloClient.mutate<
          gql.UpdateOrderStatusMutation,
          gql.UpdateOrderStatusMutationVariables
        >({
          mutation: gql.UpdateOrderStatusDocument,
          variables: {
            id: orderId,
            status: newStatus
          }
        })
      }
    } catch (error) {
      console.error('Error during drag and drop:', error)
      this.setError(error as Error)
      await this.load()
    }
  }
}

export const reclamationStore = new ReclamationStore()
