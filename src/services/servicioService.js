import { api, json } from './api'

export const listarServicios = () => api('/servicios')
export const buscarServicio = id => api(`/servicios/${id}`)
export const crearServicio = datos => api('/servicios', json('POST', datos))
export const actualizarServicio = (id, datos) => api(`/servicios/${id}`, json('PUT', datos))
export const eliminarServicio = id => api(`/servicios/${id}`, { method: 'DELETE' })
