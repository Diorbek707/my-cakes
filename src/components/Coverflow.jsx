import { useState, useEffect, useRef } from 'react'

export default function Coverflow({ t, items }) {
  const n = items.length
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  const x0 = useRef(0)
  useEffect(() => { if (n < 2 || hold) return; const id = setInterval(() => setI(v => (v + 1) % n), 4500); return () => clearInterval(id) }, [n, hold])
  if (!n) return null
  const go = d => setI(v => (v + d + n) % n)
  return <section className="gal" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
    <h2 className="sec">{t.gallery}</h2>
    <div className="cf" onTouchStart={e => { x0.current = e.touches[0].clientX }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - x0.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1) }}>
      {items.map((it, k) => {
        let d = k - i; if (d > n / 2) d -= n; if (d < -n / 2) d += n
        const a = Math.abs(d)
        const src = it.image || `https://loremflickr.com/800/1000/${it.kw || 'cake'}?lock=${it.id + 40}`
        return <figure key={it.id} className={'cfi' + (d === 0 ? ' on' : '')} onClick={() => setI(k)}
          style={{ transform: `translateX(calc(-50% + ${d * 58}%)) scale(${1 - Math.min(a, 3) * .16}) rotateY(${-d * 22}deg)`, zIndex: 10 - a, opacity: a > 2 ? 0 : 1 - a * .3, pointerEvents: a > 2 ? 'none' : 'auto' }}>
          <img src={src} alt={it.title} loading="lazy" />
          <figcaption><b>{it.title}</b><span>{it.desc}</span></figcaption>
        </figure>
      })}
    </div>
    <div className="cfnav"><button className="arr2" onClick={() => go(-1)} aria-label="prev">‹</button>
      <div className="dots2">{items.map((_, k) => <i key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
      <button className="arr2" onClick={() => go(1)} aria-label="next">›</button></div>
  </section>
}
