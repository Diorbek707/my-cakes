import { useState } from 'react'
import Pic from './Pic.jsx'
import { fmt, nid, priceOf } from '../utils/helpers.js'

export default function CartDrawer({ t, phone, open, onClose, products, cart, setCart, orders, setOrders, users, setUsers, toast }) {
  const [f, setF] = useState({ name: '', phone: '', address: '' })
  const items = Object.entries(cart).map(([key, q]) => { const [id, size = ''] = key.split('|'); const p = products.find(x => x.id == id); return { key, p, size, q, price: p ? priceOf(p, size) : 0 } }).filter(x => x.p && typeof x.q === 'number')
  const total = items.reduce((s, x) => s + x.price * x.q, 0)
  const chg = (key, d) => setCart(c => { const q = (c[key] || 0) + d; const n = { ...c }; q <= 0 ? delete n[key] : n[key] = q; return n })
  const name = x => x.p.title + (x.size ? ' · ' + x.size : '')
  const send = () => {
    if (!f.name || !f.phone || !f.address) return toast(t.fill)
    const order = { id: nid(orders), ...f, items: items.map(x => ({ title: name(x), q: x.q, price: x.price })), total, status: 'new', date: new Date().toLocaleString() }
    setOrders([order, ...orders])
    setUsers(u => u.some(x => x.phone === f.phone) ? u : [...u, { id: nid(u), name: f.name, phone: f.phone, blocked: false }])
    const text = `Новый заказ #${order.id}\nИмя: ${f.name}\nТелефон: ${f.phone}\nАдрес: ${f.address}\n\n` + items.map(x => `• ${name(x)} × ${x.q} = ${fmt(x.price * x.q)}`).join('\n') + `\n\n${t.total}: ${fmt(total)} ${t.sum}`
    toast(t.sent); setCart({})
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')
    onClose()
  }
  const blocked = users.some(u => u.phone === f.phone && u.blocked)
  return <aside className={'drawer' + (open ? ' open' : '')}>
    <div className="dhead"><h2>{t.cart}</h2><button className="x" onClick={onClose}>✕</button></div>
    {!items.length ? <p className="muted pad">{t.empty}</p> : <>
      <div className="dbody">{items.map(x => <div className="line" key={x.key}>
        <Pic p={x.p} /><div className="grow"><b>{name(x)}</b><div className="muted">{fmt(x.price)} {t.sum}</div></div>
        <div className="qty"><button onClick={() => chg(x.key, -1)}>−</button>{x.q}<button onClick={() => chg(x.key, 1)}>+</button></div></div>)}</div>
      <div className="dfoot">
        {['name', 'phone', 'address'].map(k => <input key={k} placeholder={t[k]} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} />)}
        <div className="row"><span>{t.total}</span><b>{fmt(total)} {t.sum}</b></div>
        <button className="btn wa" disabled={blocked} onClick={send}>{blocked ? t.blocked : t.order}</button>
      </div></>}
  </aside>
}
