const AUTH_URL = import.meta.env.VITE_AUTH_API_URL
const API_URL = import.meta.env.VITE_API_URL

async function request(baseUrl, ruta, opciones = {}) {
  const token = sessionStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...opciones.headers }
  if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${baseUrl}${ruta}`, { ...opciones, headers })
  } catch {
    throw new Error('No fue posible conectar con el servidor. Revisa que el backend esté en ejecución.')
  }

  // Un 401 con token significa que la sesión ya no es válida (vencida o alterada)
  if (response.status === 401 && headers.Authorization) {
    window.dispatchEvent(new Event('sesion-expirada'))
    throw new Error('Tu sesión expiró. Ingresa nuevamente.')
  }
  if (response.status === 403) {
    throw new Error('No tienes permisos para realizar esta acción.')
  }
  if (!response.ok) {
    const cuerpo = await response.json().catch(() => ({}))
    throw new Error(cuerpo.error ?? cuerpo.mensaje ?? `El servidor respondió ${response.status}`)
  }
  return response.status === 204 ? null : response.json()
}

export const authApi = (ruta, opciones) => request(AUTH_URL, ruta, opciones)
export const api = (ruta, opciones) => request(API_URL, ruta, opciones)

export const json = (method, datos) => ({ method, body: JSON.stringify(datos) })
