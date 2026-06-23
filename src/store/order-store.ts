import { create } from 'zustand'
import type { Order, OrderItem } from '../types'

interface OrderState {
  orders: Record<string, Order>
  addItem: (guestId: string, item: Omit<OrderItem, 'id'>) => void
  getOrder: (guestId: string) => Order
}

const emptyOrder = (guestId: string): Order => ({ guestId, items: [] })

let itemSeq = 1

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: {},

  getOrder: (guestId) => get().orders[guestId] ?? emptyOrder(guestId),

  addItem: (guestId, item) =>
    set((state) => {
      const order = state.orders[guestId] ?? emptyOrder(guestId)
      const newItem: OrderItem = { ...item, id: `item-${itemSeq++}` }
      return {
        orders: {
          ...state.orders,
          [guestId]: { ...order, items: [...order.items, newItem] },
        },
      }
    }),
}))
