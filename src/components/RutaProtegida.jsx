import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { RUTA_INICIO } from '../utils/roles'

// Mejora la navegación; la protección real de los datos está en el backend
function RutaProtegida({ roles }) {
  const { sesion } = useAuth()
  const location = useLocation()

  if (!sesion) return <Navigate to="/ingreso" replace state={{ desde: location.pathname }} />
  if (roles && !roles.includes(sesion.rol)) return <Navigate to={RUTA_INICIO[sesion.rol] ?? '/'} replace />
  return <Outlet />
}

export default RutaProtegida
