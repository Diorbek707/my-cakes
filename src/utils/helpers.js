export const fmt = n => Number(n).toLocaleString('ru-RU')
export const nid = a => Math.max(0, ...a.map(x => x.id)) + 1
export const parseSizes = s => (s || '').split(',').map(x => x.split('=')).filter(a => a.length === 2 && +a[1]).map(([l, p]) => ({ label: l.trim(), price: +p }))
export const priceOf = (p, label) => parseSizes(p.sizes).find(s => s.label === label)?.price ?? p.price
export const fromPrice = p => { const a = parseSizes(p.sizes); return a.length ? Math.min(...a.map(s => s.price)) : p.price }
