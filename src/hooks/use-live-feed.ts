import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useLiveFeedStore } from '../store'
import type { Guest } from '../types'

const SERVER_URL = 'http://localhost:3333'

export function useLiveFeed() {
  const addGuest = useLiveFeedStore((s) => s.addGuest)
  const setConnectionStatus = useLiveFeedStore((s) => s.setConnectionStatus)

  useEffect(() => {
    const socket = io(SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    })

    socket.on('connect',            () => setConnectionStatus('connected'))
    socket.on('disconnect',         () => setConnectionStatus('reconnecting'))
    socket.on('reconnect_attempt',  () => setConnectionStatus('reconnecting'))
    socket.on('connect_error',      () => setConnectionStatus('error'))
    socket.on('new-customer', (customer: Guest) => addGuest(customer))

    return () => { socket.disconnect() }
  }, [addGuest, setConnectionStatus])
}
