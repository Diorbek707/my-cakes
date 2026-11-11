import { useState } from 'react'

export default function Pic({ p }) {
  const [bad, setBad] = useState(false)
  const src = p.image || `https://loremflickr.com/640/480/${p.kw || 'cake'}?lock=${p.id}`
  return <div className="pic">{bad ? <span /> : <img src={src} alt={p.title} loading="lazy" onError={() => setBad(true)} />}</div>
}
