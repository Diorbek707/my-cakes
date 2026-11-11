import { useState, useEffect } from 'react'

const img = (k, n) => `https://loremflickr.com/1400/700/${k}?lock=${n}`
export default function Carousel({ t, s }) {
  const slides = [
    { a: t.hero1, b: t.hero1s, i: s.s1 || img('cake,chocolate', 11) },
    { a: t.hero2, b: t.hero2s, i: s.s2 || img('pastry,eclair', 12) },
    { a: t.hero3, b: t.hero3s, i: s.s3 || img('macarons', 13) }]
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI(x => (x + 1) % 3), 5000); return () => clearInterval(id) }, [])
  return <div className="carousel">
    <div className="track" style={{ transform: `translateX(-${i * 100}%)` }}>
      {slides.map((s, k) => <div className="slide" key={k} style={{ backgroundImage: `url(${s.i})` }}>
        <div><h1>{s.a}</h1><p>{s.b}</p>
          <button className="btn lg" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>{t.menu}</button></div></div>)}
    </div>
    <button className="arr l" onClick={() => setI((i + 2) % 3)} aria-label="prev">‹</button>
    <button className="arr r" onClick={() => setI((i + 1) % 3)} aria-label="next">›</button>
    <div className="dots">{slides.map((_, k) => <i key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
  </div>
}
