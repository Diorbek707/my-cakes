export function About({ t }) {
  return <section className="wrap info"><h2 className="sec">{t.about}</h2><p>{t.aboutT}</p></section>
}
export function Delivery({ t }) {
  return <section className="wrap info"><h2 className="sec">{t.delivery}</h2><p>{t.delT}</p></section>
}
export function Contacts({ t, s }) {
  return <section className="wrap info"><h2 className="sec">{t.contacts}</h2>
    <div className="cgrid">
      <div className="cbox"><b>{t.phone}</b><a href={`tel:+${s.phone}`}>+{s.phone}</a></div>
      <div className="cbox"><b>{t.address}</b><span>{s.address}</span></div>
      <div className="cbox"><b>{t.hours}</b><span>{s.hours}</span></div>
    </div>
    <a className="btn wa lg" style={{ display: 'block', textAlign: 'center', marginTop: 20 }} href={`https://wa.me/${s.phone}`} target="_blank" rel="noreferrer">{t.write}</a>
  </section>
}
