import { useState, useEffect } from 'react'
import Pic from './Pic.jsx'
import { fmt, parseSizes, priceOf } from '../utils/helpers.js'

export default function ProductModal({ t, p, cat, onClose, onAdd }) {
  const sizes = parseSizes(p.sizes)
  const [i, setI] = useState(0)
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [])
  const size = sizes[i]?.label || ''
  const rows = [['weight', p.weight], ['serves', p.serves], ['comp', p.comp], ['shelf', p.shelf]].filter(r => r[1])
  return <div className="pm" onClick={onClose}><div className="pbox" onClick={e => e.stopPropagation()}>
    <button className="x pclose" onClick={onClose} aria-label="close">✕</button>
    <div className="pimg"><Pic p={p} /></div>
    <div className="pinfo">
      {cat && <span className="pcat">{cat.title}</span>}
      <h2>{p.title}</h2><p className="muted">{p.desc}</p>
      {sizes.length > 0 && <div><b className="lab">{t.size}</b><div className="sizes">{sizes.map((s, k) =>
        <button key={k} className={'chip' + (k === i ? ' on' : '')} onClick={() => setI(k)}>{s.label}<small>{fmt(s.price)}</small></button>)}</div></div>}
      {rows.length > 0 && <dl className="specs">{rows.map(([k, v]) => <div key={k}><dt>{t[k]}</dt><dd>{v}</dd></div>)}</dl>}
      <div className="pbuy"><div className="pprice">{fmt(priceOf(p, size))} {t.sum}</div>
        <button className="btn lg" onClick={() => { onAdd(p, size); onClose() }}>{t.add}</button></div>
    </div></div></div>
}
