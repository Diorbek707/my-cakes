import { useState, useEffect } from 'react'

export function useLS(key, init) {
  const [v, setV] = useState(() => { try { const s = localStorage.getItem('sc_' + key); return s ? JSON.parse(s) : init } catch { return init } })
  useEffect(() => { localStorage.setItem('sc_' + key, JSON.stringify(v)) }, [key, v])
  return [v, setV]
}
