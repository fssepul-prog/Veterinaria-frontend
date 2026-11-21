import { api, json } from './api'

export const listarPacientes = () => api('/pacientes')
export const buscarPaciente = id => api(`/pacientes/${id}`)
export const crearPaciente = datos => api('/pacientes', json('POST', datos))
