import { api, json } from './api'

export const listarFichas = pacienteId => api(pacienteId ? `/fichas?pacienteId=${pacienteId}` : '/fichas')
export const listarMisFichas = () => api('/fichas/mias')
export const crearFicha = datos => api('/fichas', json('POST', datos))
export const actualizarFicha = (id, datos) => api(`/fichas/${id}`, json('PUT', datos))
