import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { RUTA_INICIO } from '../../utils/roles'

const ESTADO_INICIAL = { email: '', contrasena: '' }

function Ingreso() {
  const navigate                  = useNavigate()
  const { sesion, iniciarSesion } = useAuth()
  const [form, setForm]           = useState(ESTADO_INICIAL)
  const [error, setError]         = useState('')
  const [enviando, setEnviando]   = useState(false)

  if (sesion) return <Navigate to={RUTA_INICIO[sesion.rol]} replace />

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    if (!form.email.trim() || !form.contrasena) {
      setError('Ingresa tu correo y tu contraseña.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      const usuario = await iniciarSesion({ correo: form.email.trim(), password: form.contrasena })
      navigate(RUTA_INICIO[usuario.rol] ?? '/')
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
                <h1 className="h4 mb-1 text-center">Ingresar</h1>
                <p className="text-muted text-center mb-4">
                  Accede a tu cuenta para revisar tus solicitudes.
                </p>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">{error}</div>
                )}

                <form onSubmit={manejarEnvio} noValidate>
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

                  <div className="mb-4">
                    <label htmlFor="contrasena" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      id="contrasena"
                      name="contrasena"
                      className="form-control"
                      value={form.contrasena}
                      onChange={manejarCambio}
                      autoComplete="current-password"
                    />
                  </div>

                  <button type="submit" className="btn btn-success w-100" disabled={enviando}>
                    {enviando ? 'Ingresando...' : 'Ingresar'}
                  </button>
                </form>

                <hr className="my-4" />

                <p className="text-center mb-0">
                  ¿No tienes cuenta?{' '}
                  <Link to="/registro">Regístrate aquí</Link>
                </p>
              </div>
            </div>

          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default Ingreso
