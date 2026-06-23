import { create } from 'zustand'
import type { Guest } from '../types'

const CAPACITY = 500

interface LiveFeedState {
  guests: Guest[]
  totalPresent: number
  totalVip: number
  occupancyRate: number
  addGuest: (guest: Guest) => void
}

export const useLiveFeedStore = create<LiveFeedState>((set) => ({
  guests: [],
  totalPresent: 0,
  totalVip: 0,
  occupancyRate: 0,

  addGuest: (guest) =>
    set((state) => {
      const guests = [guest, ...state.guests]
      const totalPresent = guests.length
      const totalVip = guests.filter((g) => g.isVip).length
      const occupancyRate = Math.min((totalPresent / CAPACITY) * 100, 100)
      return { guests, totalPresent, totalVip, occupancyRate }
    }),
}))
