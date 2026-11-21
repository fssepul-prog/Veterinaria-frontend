import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES, RUTA_INICIO } from '../utils/roles'

const PUBLICO = [
  ['/', 'Inicio'],
  ['/nosotros', 'Nosotros'],
  ['/servicios', 'Servicios'],
  ['/agenda', 'Agenda'],
  ['/recursos', 'Recursos'],
]

// Cada rol ve solo los enlaces de las vistas que puede usar
const MENU = {
  ADMIN: [
    ['/admin/servicios', 'Servicios'],
    ['/admin/citas', 'Citas'],
    ['/recepcion/fichas', 'Fichas'],
    ['/admin/historial', 'Pacientes'],
    ['/admin/usuarios', 'Usuarios'],
    ['/admin/reportes', 'Reportes'],
  ],
  RECEPCIONISTA: [
    ['/recepcion/citas', 'Citas'],
    ['/recepcion/fichas', 'Fichas'],
  ],
  CLIENTE: [
    ...PUBLICO,
    ['/citas', 'Solicitar hora'],
    ['/mi-cuenta', 'Mi cuenta'],
  ],
}

function Navegacion() {
  const navigate = useNavigate()
  const { sesion, cerrarSesion } = useAuth()

  function salir() {
    cerrarSesion()
    navigate('/')
  }

  return (
    <Navbar expand="md" className="navbar-vet">
      <Container>
        <Navbar.Brand as={NavLink} to={sesion ? RUTA_INICIO[sesion.rol] : '/'} className="navbar-brand-vet">
          <img
            src="/logo.png"
            alt=""
            width="30"
            height="30"
            className="d-inline-block align-text-top me-2"
          />
          Veterinaria San Marcos
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            {(sesion ? MENU[sesion.rol] ?? [] : [...PUBLICO, ['/citas', 'Solicitar hora']]).map(([ruta, texto]) => (
              <Nav.Link key={ruta} as={NavLink} to={ruta} end={ruta === '/'}>{texto}</Nav.Link>
            ))}
          </Nav>

          <Nav className="gap-2 ms-md-3 mt-2 mt-md-0 align-items-md-center">
            {sesion ? (
              <>
                <span className="navbar-text small">
                  {sesion.nombre} · {ROLES[sesion.rol]}
                </span>
                <button type="button" className="nav-link btn-nav-auth" onClick={salir}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/ingreso" className="btn-nav-auth">Ingresar</Nav.Link>
                <Nav.Link as={NavLink} to="/registro" className="btn-nav-auth btn-nav-registro">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navegacion
