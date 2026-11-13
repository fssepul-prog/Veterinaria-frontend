import { useState } from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCarga } from '../../hooks/useCarga'
import { listarServicios } from '../../services/servicioService'
import { crearCita } from '../../services/citaService'
import { formatearFecha, hoyIso, pesos } from '../../utils/formato'
import EstadoCita from '../../components/EstadoCita'

const HORAS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']

function Citas() {
  const { sesion }       = useAuth()
  const [params]         = useSearchParams()
  const estadoInicial = {
    telefono:      '',
    mascota:       '',
    especie:       '',
    servicioId:    params.get('servicio') ?? '',
    fecha:         '',
    hora:          '',
    observaciones: '',
  }
  const [form, setForm]         = useState(estadoInicial)
  const [error, setError]       = useState('')
  const [enviando, setEnviando] = useState(false)
  const [creada, setCreada]     = useState(null)
  const servicios = useCarga(listarServicios)

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    const faltantes = ['mascota', 'especie', 'servicioId', 'fecha', 'hora'].filter((campo) => !form[campo])
    if (faltantes.length > 0) {
      setError('Completa la mascota, la especie, el servicio, la fecha y la hora.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      // El correo del dueño lo toma el backend desde el token, no desde el formulario
      const cita = await crearCita({
        dueno:         sesion.nombre,
        telefono:      form.telefono.trim(),
        mascota:       form.mascota.trim(),
        especie:       form.especie,
        servicio:      { id: Number(form.servicioId) },
        fecha:         form.fecha,
        hora:          form.hora,
        observaciones: form.observaciones.trim(),
      })
      setCreada(cita)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  function nuevaSolicitud() {
    setForm({ ...estadoInicial, servicioId: '' })
    setCreada(null)
  }

  if (creada) {
    return (
      <main>
        <Container className="py-4" style={{ maxWidth: '42rem' }}>
          <div className="aviso text-center py-5">
            <h1 className="h3">¡Solicitud enviada!</h1>
            <p className="mt-3">
              Registramos tu solicitud para <strong>{creada.mascota}</strong> el{' '}
              <strong>{formatearFecha(creada.fecha)}</strong> a las <strong>{creada.hora}</strong>.
            </p>
            <p>Estado actual: <EstadoCita estado={creada.estado} /></p>
            <p className="text-muted">
              La recepción la confirmará o te propondrá otro horario. Puedes seguir el estado en Mi cuenta.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
              <button className="btn btn-success" onClick={nuevaSolicitud}>
                Nueva solicitud
              </button>
              <Link to="/mi-cuenta" className="btn btn-outline-success">Ver mis citas</Link>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main>
      <Container className="py-4">

        <header className="encabezado-pagina">
          <p className="etiqueta">Reserva en línea</p>
          <h1>Solicitar hora</h1>
          <p className="text-muted">
            Completa el formulario y la recepción confirmará tu hora o te propondrá otra.
          </p>
        </header>

        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            {error && <Alert variant="danger">{error}</Alert>}

            <form onSubmit={manejarEnvio} noValidate>

              <fieldset className="mb-4">
                <legend className="h5 mb-3">Datos de contacto</legend>
                <p className="mb-2">
                  <strong>{sesion.nombre}</strong> · {sesion.correo}
                </p>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono de contacto (opcional)</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="form-control"
                    value={form.telefono}
                    onChange={manejarCambio}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </fieldset>

              <fieldset className="mb-4">
                <legend className="h5 mb-3">Datos de la mascota</legend>
                <Row>
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <label htmlFor="mascota" className="form-label">Nombre de la mascota</label>
                      <input
                        type="text"
                        id="mascota"
                        name="mascota"
                        className="form-control"
                        value={form.mascota}
                        onChange={manejarCambio}
                        placeholder="Ej: Firulais"
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <label htmlFor="especie" className="form-label">Especie</label>
                      <select
                        id="especie"
                        name="especie"
                        className="form-select"
                        value={form.especie}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona...</option>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                        <option value="Conejo">Conejo</option>
                        <option value="Ave">Ave</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </fieldset>

              <fieldset className="mb-4">
                <legend className="h5 mb-3">Servicio y horario</legend>

                <div className="mb-3">
                  <label htmlFor="servicioId" className="form-label">Servicio solicitado</label>
                  <select
                    id="servicioId"
                    name="servicioId"
                    className="form-select"
                    value={form.servicioId}
                    onChange={manejarCambio}
                    disabled={servicios.cargando}
                  >
                    <option value="">{servicios.cargando ? 'Cargando servicios...' : 'Selecciona un servicio...'}</option>
                    {(servicios.datos ?? []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} — {pesos(s.precio)}
                      </option>
                    ))}
                  </select>
                  {servicios.error && <div className="form-text text-danger">{servicios.error}</div>}
                </div>

                <Row>
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <label htmlFor="fecha" className="form-label">Fecha preferida</label>
                      <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        className="form-control"
                        min={hoyIso()}
                        value={form.fecha}
                        onChange={manejarCambio}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <label htmlFor="hora" className="form-label">Hora preferida</label>
                      <select
                        id="hora"
                        name="hora"
                        className="form-select"
                        value={form.hora}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona...</option>
                        {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <label htmlFor="observaciones" className="form-label">Observaciones (opcional)</label>
                  <textarea
                    id="observaciones"
                    name="observaciones"
                    className="form-control"
                    rows={3}
                    value={form.observaciones}
                    onChange={manejarCambio}
                    placeholder="Indica cualquier detalle relevante sobre la condición de tu mascota..."
                  />
                </div>
              </fieldset>

              <div className="d-flex flex-wrap gap-3">
                <button type="submit" className="btn btn-success" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar solicitud'}
                </button>
                <Link to="/servicios" className="btn btn-outline-success">
                  Ver catálogo de servicios
                </Link>
              </div>

            </form>
          </Col>
        </Row>

      </Container>
    </main>
  )
}

export default Citas
