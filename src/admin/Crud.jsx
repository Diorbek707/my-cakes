import { useState } from 'react'

function shrink(file, done) {
  const r = new FileReader()
  r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 700 / im.width), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); done(c.toDataURL('image/jpeg', .8)) }; im.src = r.result }
  r.readAsDataURL(file)
}

export default function Crud({ t, rows, fields, onSave, onDelete, render }) {
  const [e, setE] = useState(null)
  const pick = f => f && shrink(f, d => setE(x => ({ ...x, image: d })))
  return <>
    <button className="btn" onClick={() => setE({})}>＋ {t.create}</button>
    <div className="tablewrap"><table><tbody>
      {rows.map(r => <tr key={r.id}>{render(r)}<td className="act">
        <button className="btn sm ghost" onClick={() => setE(r)}>{t.edit}</button>
        <button className="btn sm danger" onClick={() => confirm('?') && onDelete(r.id)}>{t.del}</button></td></tr>)}
      {!rows.length && <tr><td className="muted">{t.noRows}</td></tr>}
    </tbody></table></div>
    {e && <div className="modal" onClick={() => setE(null)}><form className="mbox" onClick={x => x.stopPropagation()}
      onSubmit={ev => { ev.preventDefault(); onSave(e); setE(null) }}>
      {fields.map(f => <label key={f.k}>{t[f.l]}
        {f.opts ? <select value={e[f.k] ?? ''} onChange={x => setE({ ...e, [f.k]: +x.target.value })} required>
          <option value="" disabled>—</option>{f.opts.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}</select>
          : f.file ? <div className="filebox"><input type="text" placeholder="https://…" value={e[f.k] ?? ''} onChange={x => setE({ ...e, [f.k]: x.target.value })} /><input type="file" accept="image/*" onChange={x => pick(x.target.files[0])} /></div> : <input type={f.n ? 'number' : 'text'} required={f.req} value={e[f.k] ?? ''} onChange={x => setE({ ...e, [f.k]: f.n ? +x.target.value : x.target.value })} />}</label>)}
      <div className="row"><button type="button" className="btn ghost" onClick={() => setE(null)}>{t.cancel}</button><button className="btn">{t.save}</button></div>
    </form></div>}
  </>
}
