import EstadoCita from './EstadoCita'
import { formatearFecha } from '../utils/formato'

function TarjetaCita({ cita, ocupado, onConfirmar, onCancelar, onReagendar }) {
  const abierta = cita.estado === 'Pendiente' || cita.estado === 'Reagendada'

  return (
    <article className="card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h2 className="h5 mb-1">{cita.mascota}</h2>
          <EstadoCita estado={cita.estado} />
        </div>
        <p className="text-muted mb-2">{cita.especie}</p>
        <p className="mb-1">Dueño: {cita.dueno}</p>
        <p className="mb-1"><small>{cita.correoCliente}{cita.telefono && ` · ${cita.telefono}`}</small></p>
        <p className="mb-1">Servicio: {cita.servicio?.nombre}</p>
        <p className="mb-1">Fecha: {formatearFecha(cita.fecha)} · {cita.hora}</p>
        {cita.observaciones && <p className="mb-1"><small>Obs.: {cita.observaciones}</small></p>}

        <div className="d-flex flex-wrap gap-2 mt-auto pt-2">
          {onConfirmar && abierta && (
            <button className="btn btn-success btn-sm" disabled={ocupado} onClick={() => onConfirmar(cita.id)}>
              Confirmar
            </button>
          )}
          {onReagendar && cita.estado !== 'Cancelada' && (
            <button className="btn btn-warning btn-sm" disabled={ocupado} onClick={() => onReagendar(cita.id)}>
              Reagendar
            </button>
          )}
          {onCancelar && cita.estado !== 'Cancelada' && (
            <button className="btn btn-danger btn-sm" disabled={ocupado} onClick={() => onCancelar(cita.id)}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default TarjetaCita
