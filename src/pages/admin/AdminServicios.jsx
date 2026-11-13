import { useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import FormularioServicio from "../../components/FormularioServicio";
import Cargando from "../../components/Cargando";
import { useCarga } from "../../hooks/useCarga";
import {
  actualizarServicio, crearServicio, eliminarServicio, listarServicios,
} from "../../services/servicioService";
import { pesos } from "../../utils/formato";

const categorias = ["Todas", "Consultas", "Vacunación", "Cirugía", "Desparasitación", "Exámenes", "Otros"];

function AdminServicios() {
  const [categoria, setCategoria] = useState("Todas");
  const [editando, setEditando] = useState(null);
  const [confirmarId, setConfirmarId] = useState(null);
  const { datos, setDatos, cargando, error, setError } = useCarga(listarServicios);
  const servicios = datos ?? [];

  const visibles =
    categoria === "Todas"
      ? servicios
      : servicios.filter((servicio) => servicio.categoria === categoria);

  // Devuelve true solo si el backend guardó el servicio
  async function guardar(servicio) {
    setError("");
    try {
      if (editando) {
        const actualizado = await actualizarServicio(editando.id, servicio);
        setDatos(servicios.map((s) => (s.id === actualizado.id ? actualizado : s)));
        setEditando(null);
      } else {
        const creado = await crearServicio(servicio);
        setDatos([...servicios, creado]);
      }
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function eliminar(id) {
    setError("");
    try {
      await eliminarServicio(id);
      setDatos(servicios.filter((item) => item.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setConfirmarId(null);
    }
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4">Catálogo de servicios</h1>

      <section aria-labelledby="titulo-filtro" className="mb-4">
        <h2 id="titulo-filtro" className="h5">Filtrar por categoría</h2>
        <div className="d-flex flex-wrap gap-2 mt-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={categoria === cat ? "btn btn-success" : "btn btn-outline-success"}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

      <Row className="g-4">
        <Col xs={12} lg={8}>
          {cargando ? <Cargando texto="Cargando servicios..." /> : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <caption>Servicios de la clínica</caption>
                <thead className="table-success">
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Servicio</th>
                    <th scope="col">Categoría</th>
                    <th scope="col" className="d-none d-md-table-cell">Duración</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-muted py-3">No hay servicios en esta categoría.</td></tr>
                  )}
                  {visibles.map((servicio) => (
                    <tr key={servicio.id}>
                      <th scope="row">{servicio.codigo}</th>
                      <td>{servicio.nombre}</td>
                      <td>{servicio.categoria}</td>
                      <td className="d-none d-md-table-cell">{servicio.duracion}</td>
                      <td>{pesos(servicio.precio)}</td>
                      <td>
                        {confirmarId === servicio.id ? (
                          <div className="d-flex flex-wrap gap-1">
                            <span className="small align-self-center">¿Eliminar?</span>
                            <button className="btn btn-danger btn-sm" onClick={() => eliminar(servicio.id)}>Sí</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setConfirmarId(null)}>No</button>
                          </div>
                        ) : (
                          <div className="d-flex flex-wrap gap-1">
                            <button className="btn btn-outline-success btn-sm" onClick={() => setEditando(servicio)}>
                              Editar
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => setConfirmarId(servicio.id)}>
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Col>

        <Col xs={12} lg={4}>
          <h2 className="h5">{editando ? `Editar ${editando.nombre}` : "Nuevo servicio"}</h2>
          <FormularioServicio
            servicioEditando={editando}
            onGuardar={guardar}
            onCancelar={editando ? () => setEditando(null) : undefined}
          />
        </Col>
      </Row>
    </main>
  );
}

export default AdminServicios;
