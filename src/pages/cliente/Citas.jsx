import { useState } from 'react'
import { guardarCitas } from '../../utils/guardarCitas'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { servicios } from '../../data/servicios'

const ESTADO_INICIAL = {
  nombre:   '',
  email:    '',
  telefono: '',
  mascota:  '',
  especie:  '',
  servicio: '',
  mensaje:  '',
}

function Citas() {
  const [form, setForm]       = useState(ESTADO_INICIAL)
  const [enviado, setEnviado] = useState(false)

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const citas = JSON.parse(localStorage.getItem('citas') || '[]')
    citas.push({ ...form, id: Date.now() }) // id único basado en timestamp
    guardarCitas(citas)
    setEnviado(true)
  }

  function nuevaSolicitud() {
    setForm(ESTADO_INICIAL)
    setEnviado(false)
  }

  if (enviado) {
    return (
      <main>
        <Container className="py-4" style={{ maxWidth: '42rem' }}>
          <div className="aviso text-center py-5">
            <h1 className="h3">¡Solicitud enviada!</h1>
            <p className="mt-3">
              Hemos recibido tu solicitud para <strong>{form.mascota}</strong>.
              Te confirmaremos la hora disponible al correo{' '}
              <strong>{form.email}</strong> o al teléfono{' '}
              <strong>{form.telefono}</strong>.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-success" onClick={nuevaSolicitud}>
                Nueva solicitud
              </button>
              <Link to="/" className="btn btn-outline-success">Volver al inicio</Link>
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
            Completa el formulario y te confirmaremos la disponibilidad.
          </p>
        </header>

        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <form onSubmit={manejarEnvio} noValidate>

              {/* ── Datos del dueño ── */}
              <fieldset className="mb-4">
                <legend className="h5 mb-3">Datos de contacto</legend>

                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={manejarCambio}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <Row>
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Correo electrónico</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={manejarCambio}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono</label>
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
                  </Col>
                </Row>
              </fieldset>

              {/* ── Datos de la mascota ── */}
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

              {/* ── Servicio solicitado ── */}
              <fieldset className="mb-4">
                <legend className="h5 mb-3">Servicio</legend>

                <div className="mb-3">
                  <label htmlFor="servicio" className="form-label">Servicio solicitado</label>
                  <select
                    id="servicio"
                    name="servicio"
                    className="form-select"
                    value={form.servicio}
                    onChange={manejarCambio}
                  >
                    <option value="">Selecciona un servicio...</option>
                    {servicios.map((s) => (
                      <option key={s.id} value={s.nombre}>
                        {s.nombre} — ${s.precio.toLocaleString('es-CL')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="mensaje" className="form-label">Observaciones (opcional)</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    className="form-control"
                    rows={3}
                    value={form.mensaje}
                    onChange={manejarCambio}
                    placeholder="Indica cualquier detalle relevante sobre la condición de tu mascota..."
                  />
                </div>
              </fieldset>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-success">
                  Enviar solicitud
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
