import { useEffect, useState } from 'react'

export function useSearch(debounceMs = 300) {
  const [query, setQuery]       = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), debounceMs)
    return () => clearTimeout(t)
  }, [query, debounceMs])

  return { query, setQuery, debounced }
}
