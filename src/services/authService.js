import { authApi, json } from './api'

export const login = credenciales => authApi('/auth/login', json('POST', credenciales))
export const registro = datos => authApi('/auth/registro', json('POST', datos))
export const renovar = token =>
  authApi('/auth/renovar', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
