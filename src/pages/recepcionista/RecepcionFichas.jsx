import { useState } from "react"
import { Alert, Col, Row } from "react-bootstrap"
import TarjetaFicha from "../../components/recepcionista/TarjetaFicha"
import FormularioFicha from "../../components/recepcionista/FormularioFicha"
import FormularioPaciente from "../../components/recepcionista/FormularioPaciente"
import Cargando from "../../components/Cargando"
import { useCarga } from "../../hooks/useCarga"
import { actualizarFicha, crearFicha, listarFichas } from "../../services/fichaService"
import { crearPaciente, listarPacientes } from "../../services/pacienteService"

function RecepcionFichas() {
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState("")
  const fichas = useCarga(listarFichas)
  const pacientes = useCarga(listarPacientes)
  const error = fichas.error || pacientes.error

  const ordenadas = [...(fichas.datos ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha))

  // Devuelve true si el backend aceptó los datos, para que el formulario se limpie
  async function guardar(accion, alTerminar) {
    fichas.setError("")
    setMensaje("")
    try {
      alTerminar(await accion())
      return true
    } catch (e) {
      fichas.setError(e.message)
      return false
    }
  }

  const registrarPaciente = (datos) =>
    guardar(() => crearPaciente(datos), (nuevo) => {
      pacientes.setDatos((actual) => [...actual, nuevo])
      setMensaje(`Mascota ${nuevo.nombre} registrada. Ya puedes crear su ficha.`)
    })

  const registrarFicha = (datos) =>
    guardar(() => crearFicha(datos), (nueva) => fichas.setDatos((actual) => [nueva, ...actual]))

  const editarFicha = (id) => (datos) =>
    guardar(() => actualizarFicha(id, datos), (actualizada) => {
      fichas.setDatos((actual) => actual.map((f) => (f.id === actualizada.id ? actualizada : f)))
      setEditando(null)
    })

  return (
    <main className="container py-4">
      <h1 className="mb-4">Fichas de pacientes</h1>

      {error && (
        <Alert variant="danger" dismissible onClose={() => { fichas.setError(""); pacientes.setError("") }}>{error}</Alert>
      )}
      {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje("")}>{mensaje}</Alert>}

      <Row className="g-4">
        <Col xs={12} lg={4}>
          <section className="mb-4" aria-labelledby="titulo-nueva-ficha">
            <h2 id="titulo-nueva-ficha" className="h5">Registrar atención</h2>
            {pacientes.cargando ? <Cargando /> : (
              <FormularioFicha pacientes={pacientes.datos ?? []} onGuardar={registrarFicha} />
            )}
          </section>
          <section aria-labelledby="titulo-nuevo-paciente">
            <h2 id="titulo-nuevo-paciente" className="h5">¿Paciente nuevo?</h2>
            <FormularioPaciente onGuardar={registrarPaciente} />
          </section>
        </Col>

        <Col xs={12} lg={8}>
          {fichas.cargando && <Cargando texto="Cargando fichas..." />}
          {fichas.datos && ordenadas.length === 0 && <p className="text-muted">Aún no hay fichas registradas.</p>}
          <Row className="g-4">
            {ordenadas.map((ficha) => (
              <Col xs={12} md={6} key={ficha.id}>
                {editando === ficha.id ? (
                  <div className="card h-100">
                    <div className="card-body">
                      <h2 className="h5">Editar ficha de {ficha.paciente.nombre}</h2>
                      <FormularioFicha
                        ficha={ficha}
                        pacientes={pacientes.datos ?? []}
                        onGuardar={editarFicha(ficha.id)}
                        onCancelar={() => setEditando(null)}
                      />
                    </div>
                  </div>
                ) : (
                  <TarjetaFicha ficha={ficha} onEditar={setEditando} />
                )}
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </main>
  )
}

export default RecepcionFichas
