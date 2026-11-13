import { useEffect, useState } from 'react'

// Carga datos de la API al montar la vista y expone los estados de carga y error
export function useCarga(cargar, dependencias = []) {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true
    setCargando(true)
    setError('')
    cargar()
      .then(r => vigente && setDatos(r))
      .catch(e => vigente && setError(e.message))
      .finally(() => vigente && setCargando(false))
    return () => { vigente = false }
  }, dependencias)

  return { datos, setDatos, cargando, error, setError }
}
