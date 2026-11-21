import { useState } from "react"
import { Alert, Col, Row } from "react-bootstrap"
import TarjetaCita from "./TarjetaCita"
import FormularioReagendar from "./recepcionista/FormularioReagendar"
import Cargando from "./Cargando"
import { useCarga } from "../hooks/useCarga"
import { cambiarEstadoCita, listarCitas, reagendarCita } from "../services/citaService"

const estados = ["Todas", "Pendiente", "Reagendada", "Confirmada", "Cancelada"]

// Vista compartida: la recepcionista confirma y reagenda; el administrador además puede cancelar
function GestionCitas({ titulo, puedeCancelar = false }) {
  const [estado, setEstado] = useState("Todas")
  const [reagendando, setReagendando] = useState(null)
  const [ocupado, setOcupado] = useState(false)
  const { datos, setDatos, cargando, error, setError } = useCarga(listarCitas)

  const citas = [...(datos ?? [])].sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
  const visibles = estado === "Todas" ? citas : citas.filter((cita) => cita.estado === estado)

  // Reemplaza la cita en la lista solo cuando el backend confirmó el cambio
  async function ejecutar(accion) {
    setOcupado(true)
    setError("")
    try {
      const actualizada = await accion()
      setDatos((actual) => actual.map((c) => (c.id === actualizada.id ? actualizada : c)))
      setReagendando(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4">{titulo}</h1>

      <section aria-labelledby="titulo-filtro" className="mb-4">
        <h2 id="titulo-filtro" className="h5">Filtrar por estado</h2>
        <div className="d-flex flex-wrap gap-2 mt-2">
          {estados.map((opcion) => (
            <button
              key={opcion}
              className={estado === opcion ? "btn btn-success" : "btn btn-outline-success"}
              onClick={() => setEstado(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>
      </section>

      {cargando && <Cargando texto="Cargando citas..." />}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      {!cargando && datos && visibles.length === 0 && (
        <p className="text-muted">No hay citas en este estado.</p>
      )}

      <Row className="g-4">
        {visibles.map((cita) => (
          <Col xs={12} md={6} lg={4} key={cita.id}>
            {reagendando === cita.id ? (
              <FormularioReagendar
                cita={cita}
                ocupado={ocupado}
                onGuardar={(id, fecha, hora) => ejecutar(() => reagendarCita(id, fecha, hora))}
                onCancelar={() => setReagendando(null)}
              />
            ) : (
              <TarjetaCita
                cita={cita}
                ocupado={ocupado}
                onConfirmar={(id) => ejecutar(() => cambiarEstadoCita(id, "Confirmada"))}
                onReagendar={setReagendando}
                onCancelar={puedeCancelar ? (id) => ejecutar(() => cambiarEstadoCita(id, "Cancelada")) : undefined}
              />
            )}
          </Col>
        ))}
      </Row>
    </main>
  )
}

export default GestionCitas
