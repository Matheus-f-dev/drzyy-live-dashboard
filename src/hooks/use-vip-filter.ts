import { useState } from 'react'

export function useVipFilter() {
  const [vipOnly, setVipOnly] = useState(false)
  const toggle = () => setVipOnly((v) => !v)
  return { vipOnly, toggle }
}
