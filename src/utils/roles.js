// Códigos que envía el backend en el claim "rol" del JWT
export const ROLES = {
  ADMIN: 'Administrador',
  RECEPCIONISTA: 'Recepcionista',
  CLIENTE: 'Dueño de mascota',
}

export const RUTA_INICIO = {
  ADMIN: '/admin/servicios',
  RECEPCIONISTA: '/recepcion/citas',
  CLIENTE: '/mi-cuenta',
}

export const esPersonal = rol => rol === 'ADMIN' || rol === 'RECEPCIONISTA'
