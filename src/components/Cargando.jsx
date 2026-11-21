import { Spinner } from 'react-bootstrap'

function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="d-flex align-items-center gap-2 py-4 text-muted" role="status">
      <Spinner animation="border" size="sm" />
      <span>{texto}</span>
    </div>
  )
}

export default Cargando
