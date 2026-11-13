// El backend envía fechas LocalDate como "2026-12-01"
export function formatearFecha(iso) {
  if (!iso) return '—'
  const [anio, mes, dia] = iso.split('-')
  return `${dia}-${mes}-${anio}`
}

export const pesos = valor => `$${Number(valor ?? 0).toLocaleString('es-CL')}`

export function hoyIso() {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export function diasHasta(iso) {
  return Math.ceil((new Date(`${iso}T00:00:00`) - new Date(`${hoyIso()}T00:00:00`)) / 86400000)
}
