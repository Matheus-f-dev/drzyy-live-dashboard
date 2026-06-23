import { useState } from 'react'
import type { Guest } from '../types'

export function useGuestModal() {
  const [selected, setSelected] = useState<Guest | null>(null)

  // Captura snapshot por spread — desacopla do objeto do store
  const open  = (guest: Guest) => setSelected({ ...guest })
  const close = () => setSelected(null)

  return { selected, open, close }
}
