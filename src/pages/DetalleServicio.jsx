import { useParams, Link } from 'react-router-dom'
import { Alert, Container, Row, Col } from 'react-bootstrap'
import Cargando from '../components/Cargando'
import { useCarga } from '../hooks/useCarga'
import { buscarServicio } from '../services/servicioService'
import { pesos } from '../utils/formato'

function DetalleServicio() {
  const { id } = useParams()
  const { datos: servicio, cargando, error } = useCarga(() => buscarServicio(id), [id])

  return (
    <main>
      <Container className="py-4">

        <nav aria-label="Ruta de navegación" className="mb-4">
          <Link to="/servicios" className="text-decoration-none">
            ← Volver a servicios
          </Link>
        </nav>

        {cargando && <Cargando texto="Cargando servicio..." />}
        {error && <Alert variant="danger">{error}</Alert>}

        {servicio && (
          <Row className="g-4">
            <Col xs={12} md={6}>
              {servicio.imagen && (
                <img
                  src={'/' + servicio.imagen}
                  alt={servicio.nombre}
                  className="img-fluid rounded"
                  style={{ maxHeight: '22rem', width: '100%', objectFit: 'cover' }}
                />
              )}
            </Col>

            <Col xs={12} md={6}>
              <p className="etiqueta">{servicio.categoria}</p>
              <h1 className="h2">{servicio.nombre}</h1>

              <p className="mt-3">{servicio.descripcion}</p>

              <table className="table table-bordered mt-3">
                <tbody>
                  <tr>
                    <th scope="row">Código</th>
                    <td>{servicio.codigo}</td>
                  </tr>
                  <tr>
                    <th scope="row">Especie</th>
                    <td>{servicio.especie}</td>
                  </tr>
                  <tr>
                    <th scope="row">Duración estimada</th>
                    <td>{servicio.duracion}</td>
                  </tr>
                  <tr>
                    <th scope="row">Precio referencial</th>
                    <td><strong>{pesos(servicio.precio)}</strong></td>
                  </tr>
                </tbody>
              </table>

              <p>
                <small className="text-muted">
                  El precio es referencial y puede variar según el tamaño y la
                  condición del paciente.
                </small>
              </p>

              <Link to={`/citas?servicio=${servicio.id}`} className="btn btn-success mt-2">
                Solicitar hora para este servicio
              </Link>
            </Col>
          </Row>
        )}

      </Container>
    </main>
  )
}

export default DetalleServicio
