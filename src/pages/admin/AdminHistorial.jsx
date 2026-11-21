import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cargando from "../../components/Cargando";
import { useCarga } from "../../hooks/useCarga";
import { listarPacientes } from "../../services/pacienteService";

const especies = ["Todas", "Perro", "Gato", "Conejo", "Ave", "Otro"];

function AdminHistorial() {
  const [especie, setEspecie] = useState("Todas");
  const { datos, cargando, error } = useCarga(listarPacientes);
  const pacientes = datos ?? [];

  const visibles =
    especie === "Todas"
      ? pacientes
      : pacientes.filter((paciente) => paciente.especie === especie);

  return (
    <main className="container py-4">
      <h1 className="mb-4">Historial clínico de pacientes</h1>

      <section aria-labelledby="titulo-filtro" className="mb-4">
        <h2 id="titulo-filtro" className="h5">Filtrar por especie</h2>
        <div className="d-flex flex-wrap gap-2 mt-2">
          {especies.map((opcion) => (
            <button
              key={opcion}
              className={especie === opcion ? "btn btn-success" : "btn btn-outline-success"}
              onClick={() => setEspecie(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>
      </section>

      {cargando && <Cargando texto="Cargando pacientes..." />}
      {error && <Alert variant="danger">{error}</Alert>}

      {datos && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <caption>Pacientes registrados</caption>
            <thead className="table-success">
              <tr>
                <th scope="col">Mascota</th>
                <th scope="col">Especie</th>
                <th scope="col">Dueño</th>
                <th scope="col" className="d-none d-md-table-cell">Correo</th>
                <th scope="col">Ficha</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted py-3">No hay pacientes de esta especie.</td></tr>
              )}
              {visibles.map((paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.especie}</td>
                  <td>{paciente.nombreDueno}</td>
                  <td className="d-none d-md-table-cell">{paciente.correoDueno}</td>
                  <td>
                    <Link className="btn btn-outline-success btn-sm" to={`/admin/historial/${paciente.id}`}>
                      Ver historial
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdminHistorial;
