import { authApi, json } from './api'

export const listarUsuarios = () => authApi('/usuarios')
export const crearUsuario = datos => authApi('/usuarios', json('POST', datos))
export const actualizarUsuario = (id, cambios) => authApi(`/usuarios/${id}`, json('PUT', cambios))
