import { useState } from 'react'
import Carousel from '../components/Carousel.jsx'
import Pic from '../components/Pic.jsx'
import Coverflow from '../components/Coverflow.jsx'
import ProductModal from '../components/ProductModal.jsx'
import { fmt, parseSizes, fromPrice } from '../utils/helpers.js'

export default function Shop({ t, products, cats, setCart, s, gallery }) {
  const [f, setF] = useState(0)
  const [open, setOpen] = useState(null)
  const list = products.filter(p => !f || p.cat === f)
  const add = (p, size = '') => setCart(c => { const k = p.id + '|' + size; return { ...c, [k]: (c[k] || 0) + 1 } })
  return <>
    <Carousel t={t} s={s} />
    <div className="feats">{[1, 2, 3].map(n => <div key={n}><b>{t['f' + n]}</b><span>{t['f' + n + 's']}</span></div>)}</div>
    <section id="menu" className="wrap">
      <h2 className="sec">{t.ourMenu}</h2>
      <div className="chips">
        <button className={!f ? 'chip on' : 'chip'} onClick={() => setF(0)}>{t.all}</button>
        {cats.map(c => <button key={c.id} className={f === c.id ? 'chip on' : 'chip'} onClick={() => setF(c.id)}>{c.title}</button>)}
      </div>
      <div className="grid">
        {list.map((p, k) => { const sz = parseSizes(p.sizes); return <article className="card" key={p.id} style={{ animationDelay: k * 50 + 'ms' }}>
          <div className="ph" onClick={() => setOpen(p)}><Pic p={p} /><span className="price">{sz.length > 1 && t.from + ' '}{fmt(fromPrice(p))} {t.sum}</span></div>
          <div className="cb"><h3 onClick={() => setOpen(p)}>{p.title}</h3><p className="muted">{p.desc}</p>
            <div className="cbtns"><button className="btn sm" onClick={() => setOpen(p)}>{t.details}</button></div></div>
        </article> })}
      </div>
    </section>
    <Coverflow t={t} items={gallery || []} />
    {open && <ProductModal t={t} p={open} cat={cats.find(c => c.id === open.cat)} onClose={() => setOpen(null)} onAdd={add} />}
  </>
}
