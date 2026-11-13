const COLOR = {
  Pendiente: 'bg-warning text-dark',
  Confirmada: 'bg-success',
  Reagendada: 'bg-info text-dark',
  Cancelada: 'bg-secondary',
}

function EstadoCita({ estado }) {
  return <span className={`badge ${COLOR[estado] ?? 'bg-light text-dark'}`}>{estado}</span>
}

export default EstadoCita
