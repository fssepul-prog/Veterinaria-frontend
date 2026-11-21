import { api, json } from './api'

export const listarCitas = () => api('/citas')
export const listarMisCitas = () => api('/citas/mias')
export const crearCita = datos => api('/citas', json('POST', datos))
export const cambiarEstadoCita = (id, estado) => api(`/citas/${id}/estado`, json('PUT', { estado }))
export const reagendarCita = (id, fecha, hora) => api(`/citas/${id}/reagendar`, json('PUT', { fecha, hora }))
