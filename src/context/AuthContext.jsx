import { createContext, useContext, useEffect, useState } from 'react'
import { login, registro, renovar } from '../services/authService'

const AuthContext = createContext(null)

function limpiar() {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('usuario')
}

function expiracion(token) {
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(payload)).exp * 1000
}

// Se ejecuta al cargar la página: así la sesión sobrevive a una recarga
function leerSesion() {
  try {
    const token = sessionStorage.getItem('token')
    const usuario = JSON.parse(sessionStorage.getItem('usuario'))
    if (!token || !usuario || expiracion(token) <= Date.now()) {
      limpiar()
      return null
    }
    return { token, ...usuario }
  } catch {
    limpiar()
    return null
  }
}

// Solo se guardan el token y datos mínimos; nunca la contraseña
function guardar(respuesta) {
  sessionStorage.setItem('token', respuesta.token)
  sessionStorage.setItem('usuario', JSON.stringify({
    correo: respuesta.correo,
    nombre: respuesta.nombre,
    rol: respuesta.rol,
  }))
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  async function iniciarSesion(credenciales) {
    const r = await login(credenciales)
    guardar(r)
    setSesion(leerSesion())
    return r
  }

  async function registrarse(datos) {
    const r = await registro(datos)
    guardar(r)
    setSesion(leerSesion())
    return r
  }

  function cerrarSesion() {
    limpiar()
    setSesion(null)
  }

  useEffect(() => {
    window.addEventListener('sesion-expirada', cerrarSesion)
    return () => window.removeEventListener('sesion-expirada', cerrarSesion)
  }, [])

  // Pide un token nuevo 5 minutos antes de que venza el actual
  useEffect(() => {
    if (!sesion) return
    const espera = expiracion(sesion.token) - Date.now() - 5 * 60 * 1000
    const id = setTimeout(async () => {
      try {
        guardar(await renovar(sesion.token))
        setSesion(leerSesion())
      } catch {
        cerrarSesion()
      }
    }, Math.max(espera, 0))
    return () => clearTimeout(id)
  }, [sesion])

  return (
    <AuthContext.Provider value={{ sesion, iniciarSesion, registrarse, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
