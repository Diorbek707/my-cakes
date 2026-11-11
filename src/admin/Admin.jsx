import { useState } from 'react'
import Crud from './Crud.jsx'
import Pic from '../components/Pic.jsx'
import { useLS } from '../hooks/useLocalStorage.js'
import { fmt, nid } from '../utils/helpers.js'
import { ADMIN_PASSWORD } from '../config.js'

export default function Admin({ t, db, goto, auth, setAuth }) {
  const [pw, setPw] = useState(''); const [tab, setTab] = useState('dash'); const [err, setErr] = useState('')
  const { gallery, setGallery, settings, setSettings, products, setProducts, cats, setCats, orders, setOrders, users, setUsers } = db
  if (!auth) return <div className="login"><form className="mbox" onSubmit={e => { e.preventDefault(); pw === ADMIN_PASSWORD ? setAuth(true) : setErr(t.wrong) }}>
    <h2>🔐 {t.admin}</h2><input type="password" placeholder={t.password} value={pw} onChange={e => setPw(e.target.value)} />
    {err && <p className="err">{err}</p>}<button className="btn">{t.login}</button></form></div>
  const upsert = (set, list) => r => set(r.id ? list.map(x => x.id === r.id ? r : x) : [...list, { ...r, id: nid(list) }])
  const menu = [['dash'], ['products'], ['gallery'], ['categories'], ['orders'], ['users'], ['settings']]
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const st = ['new', 'cooking', 'done', 'cancelled']
  return <div className="admin">
    <nav className="atabs">{menu.map(([k]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{t[k]}</button>)}
      <button className="out" onClick={() => { setAuth(false); goto('home') }}>{t.logout}</button></nav>
    <div className="panel" key={tab}>
      <h2>{t[tab]}</h2>
      {tab === 'dash' && <div className="stats">
        {[[t.revenue, fmt(revenue) + ' ' + t.sum], [t.count, orders.length], [t.products, products.length], [t.users, users.length]].map(([a, b]) => <div className="stat" key={a}><span>{a}</span><b>{b}</b></div>)}</div>}
      {tab === 'products' && <Crud t={t} rows={products} onSave={upsert(setProducts, products)} onDelete={id => setProducts(products.filter(x => x.id !== id))}
        fields={[{ k: 'title', l: 'title', req: 1 }, { k: 'price', l: 'price', n: 1, req: 1 }, { k: 'cat', l: 'category', opts: cats }, { k: 'image', l: 'image', file: 1 }, { k: 'desc', l: 'desc' }, { k: 'sizes', l: 'sizes' }, { k: 'weight', l: 'weight' }, { k: 'serves', l: 'serves' }, { k: 'comp', l: 'comp' }, { k: 'shelf', l: 'shelf' }]}
        render={r => <><td><Pic p={r} /></td><td><b>{r.title}</b><div className="muted">{cats.find(c => c.id === r.cat)?.title}</div></td><td>{fmt(r.price)} {t.sum}</td></>} />}
      {tab === 'gallery' && <Crud t={t} rows={gallery} onSave={upsert(setGallery, gallery)} onDelete={id => setGallery(gallery.filter(x => x.id !== id))}
        fields={[{ k: 'title', l: 'title', req: 1 }, { k: 'desc', l: 'desc' }, { k: 'image', l: 'image', file: 1 }]}
        render={r => <><td><Pic p={{ ...r, kw: r.kw || 'cake' }} /></td><td><b>{r.title}</b><div className="muted">{r.desc}</div></td></>} />}
      {tab === 'categories' && <Crud t={t} rows={cats} onSave={upsert(setCats, cats)} onDelete={id => setCats(cats.filter(x => x.id !== id))}
        fields={[{ k: 'title', l: 'title', req: 1 }, { k: 'image', l: 'image', file: 1 }]} render={r => <><td><Pic p={{ ...r, kw: 'dessert' }} /></td><td><b>{r.title}</b></td></>} />}
      {tab === 'orders' && <div className="tablewrap"><table><tbody>
        {orders.map(o => <tr key={o.id}><td><b>#{o.id}</b><div className="muted">{o.date}</div></td>
          <td>{o.name}<div className="muted">{o.phone} · {o.address}</div></td>
          <td className="muted">{o.items.map(i => `${i.title}×${i.q}`).join(', ')}</td><td><b>{fmt(o.total)}</b></td>
          <td><select className={'st ' + o.status} value={o.status} onChange={e => setOrders(orders.map(x => x.id === o.id ? { ...x, status: e.target.value } : x))}>
            {st.map(s => <option key={s} value={s}>{t[s]}</option>)}</select></td>
          <td><button className="btn sm danger" onClick={() => setOrders(orders.filter(x => x.id !== o.id))}>{t.del}</button></td></tr>)}
        {!orders.length && <tr><td className="muted">{t.noRows}</td></tr>}</tbody></table></div>}
      {tab === 'settings' && <div className="form">{[['shop', 'shopName'], ['phone', 'phone'], ['address', 'address'], ['hours', 'hours'], ['logo', 'logoUrl'], ['s1', t.slide + ' 1'], ['s2', t.slide + ' 2'], ['s3', t.slide + ' 3']].map(([k, l]) =>
        <label key={k}>{t[l] || l}<input placeholder={/^(logo|s\d)$/.test(k) ? 'https://…' : ''} value={settings[k] || ''} onChange={e => setSettings({ ...settings, [k]: e.target.value })} /></label>)}<p className="muted">{t.saved}</p></div>}
      {tab === 'users' && <div className="tablewrap"><table><tbody>
        {users.map(u => <tr key={u.id}><td>👤 <b>{u.name}</b></td><td>{u.phone}</td><td>{u.blocked && <span className="tag">{t.blocked}</span>}</td>
          <td className="act"><button className="btn sm ghost" onClick={() => setUsers(users.map(x => x.id === u.id ? { ...x, blocked: !x.blocked } : x))}>{u.blocked ? t.unblock : t.block}</button>
            <button className="btn sm danger" onClick={() => setUsers(users.filter(x => x.id !== u.id))}>{t.del}</button></td></tr>)}
        {!users.length && <tr><td className="muted">{t.noRows}</td></tr>}</tbody></table></div>}
    </div></div>
}
