import { api } from './api'

export const reporteAtenciones = (desde, hasta) =>
  api(`/reportes/atenciones?desde=${desde}&hasta=${hasta}`)
