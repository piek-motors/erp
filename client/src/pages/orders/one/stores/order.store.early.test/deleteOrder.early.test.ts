import { apolloClient } from 'api/apollo-client'
import { Order } from 'domain-model'
import * as gql from 'types/graphql-shema'
import { OrderStore } from '../order.store'

// order.store.deleteOrder.spec.ts

// order.store.deleteOrder.spec.ts
// --- Mocks ---

// Mock for apolloClient
jest.mock('api/apollo-client', () => ({
  apolloClient: {
    mutate: jest.fn()
  }
}))

// Mock for Order class
const mockOrder = {
  id: 'order-123'
  // Add other Order properties/methods as needed for future tests
} as unknown as jest.Mocked<Order>

// --- Test Suite ---

describe('OrderStore.deleteOrder() deleteOrder method', () => {
  // Happy Paths
  describe('Happy paths', () => {
    beforeEach(() => {
      // Reset mocks before each test
      ;(apolloClient.mutate as jest.Mock).mockReset()
    })

    it('should successfully call apolloClient.mutate with correct parameters when order exists', async () => {
      // This test ensures that deleteOrder calls apolloClient.mutate with the correct mutation and variables when an order exists.

      // Arrange
      const store = new OrderStore()
      store.order = mockOrder
      const mockMutationResult = { data: { deleteOrder: true } }
      ;(apolloClient.mutate as jest.Mock).mockResolvedValue(
        mockMutationResult as any as never
      )

      // Act
      const result = await store.deleteOrder()

      // Assert
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1)
      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: gql.DeleteOrderDocument,
        variables: { id: mockOrder.id }
      })
      expect(result).toBe(mockMutationResult)
    })

    it('should propagate the result from apolloClient.mutate', async () => {
      // This test ensures that the result from apolloClient.mutate is returned by deleteOrder.

      // Arrange
      const store = new OrderStore()
      store.order = mockOrder
      const expectedResult = { data: { deleteOrder: { id: mockOrder.id } } }
      ;(apolloClient.mutate as jest.Mock).mockResolvedValue(
        expectedResult as any as never
      )

      // Act
      const result = await store.deleteOrder()

      // Assert
      expect(result).toBe(expectedResult)
    })
  })

  // Edge Cases
  describe('Edge cases', () => {
    beforeEach(() => {
      // Reset mocks before each test
      ;(apolloClient.mutate as jest.Mock).mockReset()
    })

    it('should throw an error if order does not exist', async () => {
      // This test ensures that deleteOrder throws an error if the order property is not set.

      // Arrange
      const store = new OrderStore()
      // store.order is not set

      // Act & Assert
      await expect(store.deleteOrder()).rejects.toThrow('Order not found')
      expect(apolloClient.mutate).not.toHaveBeenCalled()
    })

    it('should propagate errors thrown by apolloClient.mutate', async () => {
      // This test ensures that if apolloClient.mutate throws, the error is propagated by deleteOrder.

      // Arrange
      const store = new OrderStore()
      store.order = mockOrder
      const error = new Error('Network error')
      ;(apolloClient.mutate as jest.Mock).mockRejectedValue(error as never)

      // Act & Assert
      await expect(store.deleteOrder()).rejects.toThrow('Network error')
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1)
    })

    it('should handle order with a different id type (number as string)', async () => {
      // This test ensures that deleteOrder works if the order id is a stringified number.

      // Arrange
      const store = new OrderStore()
      const orderWithNumericId = { id: '456' } as unknown as jest.Mocked<Order>
      store.order = orderWithNumericId
      ;(apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { deleteOrder: true }
      } as any as never)

      // Act
      const result = await store.deleteOrder()

      // Assert
      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: gql.DeleteOrderDocument,
        variables: { id: '456' }
      })
      expect(result).toEqual({ data: { deleteOrder: true } })
    })
  })
})
