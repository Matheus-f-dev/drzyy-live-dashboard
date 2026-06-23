import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useLiveFeedStore } from '../store'
import type { Guest } from '../types'

const SERVER_URL = 'http://localhost:3333'

export function useLiveFeed() {
  const addGuest = useLiveFeedStore((s) => s.addGuest)

  useEffect(() => {
    const socket = io(SERVER_URL)

    socket.on('new-customer', (customer: Guest) => addGuest(customer))

    return () => { socket.disconnect() }
  }, [addGuest])
}
