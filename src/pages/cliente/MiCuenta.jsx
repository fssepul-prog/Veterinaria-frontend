import { Alert, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCarga } from '../../hooks/useCarga'
import { listarMisCitas } from '../../services/citaService'
import { listarMisFichas } from '../../services/fichaService'
import { diasHasta, formatearFecha } from '../../utils/formato'
import EstadoCita from '../../components/EstadoCita'
import Cargando from '../../components/Cargando'

const DIAS_AVISO_VACUNA = 30

// Agrupa las atenciones por mascota para mostrar un historial por cada una
function agruparPorMascota(fichas) {
  const grupos = new Map()
  for (const ficha of fichas) {
    const id = ficha.paciente.id
    if (!grupos.has(id)) grupos.set(id, { paciente: ficha.paciente, fichas: [] })
    grupos.get(id).fichas.push(ficha)
  }
  return [...grupos.values()]
}

// Para cada mascota, la próxima vacuna registrada en su atención más reciente
function vacunasPorVencer(grupos) {
  return grupos
    .map(({ paciente, fichas }) => {
      const conVacuna = fichas.filter((f) => f.proximaVacuna).sort((a, b) => b.fecha.localeCompare(a.fecha))
      return conVacuna.length ? { paciente, ficha: conVacuna[0], dias: diasHasta(conVacuna[0].proximaVacuna) } : null
    })
    .filter((v) => v && v.dias <= DIAS_AVISO_VACUNA)
}

function MiCuenta() {
  const { sesion } = useAuth()
  const citas  = useCarga(listarMisCitas)
  const fichas = useCarga(listarMisFichas)

  const grupos = agruparPorMascota(fichas.datos ?? [])
  const avisos = vacunasPorVencer(grupos)

  return (
    <main>
      <Container className="py-4">

        <header className="encabezado-pagina">
          <p className="etiqueta">Bienvenido, {sesion.nombre}</p>
          <h1>Mi cuenta</h1>
          <p>
            Revisa el estado de tus solicitudes de hora y el historial clínico de tus mascotas.
          </p>
        </header>

        {avisos.map(({ paciente, ficha, dias }) => (
          <Alert key={paciente.id} variant={dias < 0 ? 'danger' : 'warning'}>
            <strong>{paciente.nombre}:</strong>{' '}
            {dias < 0
              ? `la vacuna "${ficha.vacuna}" venció el ${formatearFecha(ficha.proximaVacuna)}.`
              : `la próxima dosis de "${ficha.vacuna}" vence el ${formatearFecha(ficha.proximaVacuna)} (en ${dias} días).`}
            {' '}<Link to="/citas" className="alert-link">Solicitar hora</Link>
          </Alert>
        ))}

        <section aria-labelledby="titulo-mis-citas" className="mb-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 id="titulo-mis-citas">Mis citas</h2>
            <Link to="/citas" className="btn btn-success btn-sm">Solicitar hora</Link>
          </div>
          {citas.cargando && <Cargando texto="Cargando tus citas..." />}
          {citas.error && <Alert variant="danger">{citas.error}</Alert>}
          {citas.datos && (
            <div className="tabla-contenedor">
              <table className="table table-striped">
                <caption>Solicitudes de hora de {sesion.nombre}</caption>
                <thead>
                  <tr>
                    <th scope="col">Mascota</th>
                    <th scope="col">Servicio</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Hora</th>
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.datos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-3">
                        Aún no has solicitado horas.
                      </td>
                    </tr>
                  ) : (
                    citas.datos.map((cita) => (
                      <tr key={cita.id}>
                        <td>{cita.mascota}</td>
                        <td>{cita.servicio?.nombre}</td>
                        <td>{formatearFecha(cita.fecha)}</td>
                        <td>{cita.hora}</td>
                        <td>
                          <EstadoCita estado={cita.estado} />
                          {cita.estado === 'Reagendada' && (
                            <div><small className="text-muted">La clínica propuso este nuevo horario.</small></div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-labelledby="titulo-historial">
          <h2 id="titulo-historial">Historial clínico de mis mascotas</h2>
          {fichas.cargando && <Cargando texto="Cargando historial..." />}
          {fichas.error && <Alert variant="danger">{fichas.error}</Alert>}
          {fichas.datos && grupos.length === 0 && (
            <p className="text-muted">
              Aún no hay atenciones registradas para tus mascotas. Aparecerán aquí después de su primera consulta.
            </p>
          )}
          {grupos.map(({ paciente, fichas: atenciones }) => (
            <div className="tabla-contenedor mb-4" key={paciente.id}>
              <table className="table table-striped">
                <caption>Historial de {paciente.nombre} ({paciente.especie})</caption>
                <thead>
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Motivo</th>
                    <th scope="col">Diagnóstico</th>
                    <th scope="col">Medicamento</th>
                    <th scope="col">Vacuna</th>
                    <th scope="col">Próximo control</th>
                  </tr>
                </thead>
                <tbody>
                  {atenciones.map((f) => (
                    <tr key={f.id}>
                      <td>{formatearFecha(f.fecha)}</td>
                      <td>{f.motivo}</td>
                      <td>{f.diagnostico}</td>
                      <td>{f.medicamento || '—'}</td>
                      <td>
                        {f.vacuna || '—'}
                        {f.proximaVacuna && <div><small className="text-muted">Próxima: {formatearFecha(f.proximaVacuna)}</small></div>}
                      </td>
                      <td>{formatearFecha(f.proximoControl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>

      </Container>
    </main>
  )
}

export default MiCuenta
