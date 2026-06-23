import { useEffect } from 'react'
import { useLiveFeedStore } from '../store'
import { generateGuest } from '../utils/guest-generator'

const INTERVAL_MS = 3000

export function useLiveFeed() {
  const addGuest = useLiveFeedStore((s) => s.addGuest)

  useEffect(() => {
    const id = setInterval(() => addGuest(generateGuest()), INTERVAL_MS)
    return () => clearInterval(id)
  }, [addGuest])
}
