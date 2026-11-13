import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { RUTA_INICIO } from '../../utils/roles'

const ESTADO_INICIAL = { nombre: '', email: '', telefono: '', contrasena: '' }

function Registro() {
  const navigate                = useNavigate()
  const { sesion, registrarse } = useAuth()
  const [form, setForm]         = useState(ESTADO_INICIAL)
  const [error, setError]       = useState('')
  const [enviando, setEnviando] = useState(false)

  if (sesion) return <Navigate to={RUTA_INICIO[sesion.rol]} replace />

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.email.trim()) {
      setError('Completa tu nombre y tu correo.')
      return
    }
    if (form.contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      // El backend siempre crea la cuenta con rol de dueño de mascota
      await registrarse({
        nombre: form.nombre.trim(),
        correo: form.email.trim(),
        telefono: form.telefono.trim(),
        password: form.contrasena,
      })
      navigate(RUTA_INICIO.CLIENTE)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={5}>

            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h1 className="h4 mb-1 text-center">Crear cuenta</h1>
                <p className="text-muted text-center mb-4">
                  Regístrate para solicitar horas y revisar el historial de tus mascotas.
                </p>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">{error}</div>
                )}

                <form onSubmit={manejarEnvio} noValidate>
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
                      autoComplete="name"
                    />
                  </div>

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
                      autoComplete="email"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      className="form-control"
                      value={form.telefono}
                      onChange={manejarCambio}
                      placeholder="+56 9 1234 5678"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contrasena" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      id="contrasena"
                      name="contrasena"
                      className="form-control"
                      value={form.contrasena}
                      onChange={manejarCambio}
                      autoComplete="new-password"
                      aria-describedby="ayuda-contrasena"
                    />
                    <div id="ayuda-contrasena" className="form-text">Mínimo 8 caracteres.</div>
                  </div>

                  <button type="submit" className="btn btn-success w-100" disabled={enviando}>
                    {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                  </button>
                </form>

                <hr className="my-4" />

                <p className="text-center mb-0">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/ingreso">Ingresa aquí</Link>
                </p>
              </div>
            </div>

          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default Registro
