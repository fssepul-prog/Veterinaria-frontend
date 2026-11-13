import { formatearFecha } from "../../utils/formato"

function TarjetaFicha({ ficha, onEditar }) {
  return (
    <article className="card h-100">
      <div className="card-body d-flex flex-column">
        <h2 className="h5">{ficha.paciente.nombre} <small className="text-muted">({ficha.paciente.especie})</small></h2>
        <p className="mb-1">Dueño: {ficha.paciente.nombreDueno}</p>
        <p className="mb-1">Fecha: {formatearFecha(ficha.fecha)}</p>
        <p className="mb-1">Motivo: {ficha.motivo}</p>
        <p className="mb-1">Diagnóstico: {ficha.diagnostico}</p>
        {ficha.medicamento && <p className="mb-1">Medicamento: {ficha.medicamento}</p>}
        {ficha.vacuna && (
          <p className="mb-1">Vacuna: {ficha.vacuna}{ficha.proximaVacuna && ` · próxima ${formatearFecha(ficha.proximaVacuna)}`}</p>
        )}
        {ficha.proximoControl && <p className="mb-1">Próximo control: {formatearFecha(ficha.proximoControl)}</p>}
        <button className="btn btn-outline-success btn-sm mt-auto align-self-start" onClick={() => onEditar(ficha.id)}>
          Editar
        </button>
      </div>
    </article>
  )
}

export default TarjetaFicha
