import { Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Cargando from "../../components/Cargando";
import { useCarga } from "../../hooks/useCarga";
import { buscarPaciente } from "../../services/pacienteService";
import { listarFichas } from "../../services/fichaService";
import { formatearFecha } from "../../utils/formato";

function DetalleFicha() {
  const { id } = useParams();
  const paciente = useCarga(() => buscarPaciente(id), [id]);
  const fichas = useCarga(() => listarFichas(id), [id]);
  const atenciones = [...(fichas.datos ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <main className="container py-4">
      <Link to="/admin/historial" className="text-decoration-none">← Volver a pacientes</Link>

      {(paciente.cargando || fichas.cargando) && <Cargando />}
      {(paciente.error || fichas.error) && <Alert variant="danger" className="mt-3">{paciente.error || fichas.error}</Alert>}

      {paciente.datos && (
        <>
          <h1 className="mt-3">Historial clínico: {paciente.datos.nombre}</h1>
          <p className="mb-1">Especie: {paciente.datos.especie}</p>
          <p>Dueño: {paciente.datos.nombreDueno} · {paciente.datos.correoDueno}</p>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <caption>Atenciones registradas, de la más reciente a la más antigua</caption>
              <thead className="table-success">
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Motivo</th>
                  <th scope="col">Diagnóstico</th>
                  <th scope="col">Medicamento</th>
                  <th scope="col">Vacuna</th>
                  <th scope="col">Próximo control</th>
                </tr>
              </thead>
              <tbody>
                {fichas.datos && atenciones.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted py-3">Este paciente aún no tiene atenciones.</td></tr>
                )}
                {atenciones.map((f) => (
                  <tr key={f.id}>
                    <td>{formatearFecha(f.fecha)}</td>
                    <td>{f.motivo}</td>
                    <td>{f.diagnostico}</td>
                    <td>{f.medicamento || "—"}</td>
                    <td>
                      {f.vacuna || "—"}
                      {f.proximaVacuna && <div><small className="text-muted">Próxima: {formatearFecha(f.proximaVacuna)}</small></div>}
                    </td>
                    <td>{formatearFecha(f.proximoControl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

export default DetalleFicha;
