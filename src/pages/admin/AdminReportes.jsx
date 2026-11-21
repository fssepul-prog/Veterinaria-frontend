import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import Cargando from "../../components/Cargando";
import { useCarga } from "../../hooks/useCarga";
import { reporteAtenciones } from "../../services/reporteService";
import { formatearFecha, hoyIso, pesos } from "../../utils/formato";

const inicioDeMes = () => `${hoyIso().slice(0, 8)}01`;

function AdminReportes() {
  const [filtro, setFiltro] = useState({ desde: inicioDeMes(), hasta: hoyIso() });
  const [periodo, setPeriodo] = useState(filtro);
  const { datos, cargando, error } = useCarga(
    () => reporteAtenciones(periodo.desde, periodo.hasta),
    [periodo.desde, periodo.hasta]
  );

  const porServicio = datos?.porServicio ?? [];
  const totalAtenciones = porServicio.reduce((suma, r) => suma + r.atenciones, 0);
  const totalIngresos = porServicio.reduce((suma, r) => suma + r.total, 0);

  function cambiar(evento) {
    setFiltro({ ...filtro, [evento.target.name]: evento.target.value });
  }

  function consultar(evento) {
    evento.preventDefault();
    if (filtro.desde && filtro.hasta && filtro.desde <= filtro.hasta) setPeriodo(filtro);
  }

  const rangoInvalido = !filtro.desde || !filtro.hasta || filtro.desde > filtro.hasta;

  return (
    <main className="container py-4">
      <h1 className="mb-4">Reportes de atención</h1>

      <Form onSubmit={consultar} className="mb-4">
        <Row className="g-2 align-items-end">
          <Col xs={12} sm={5} md={3}>
            <Form.Group controlId="reporte-desde">
              <Form.Label>Desde</Form.Label>
              <Form.Control type="date" name="desde" value={filtro.desde} max={filtro.hasta} onChange={cambiar} />
            </Form.Group>
          </Col>
          <Col xs={12} sm={5} md={3}>
            <Form.Group controlId="reporte-hasta">
              <Form.Label>Hasta</Form.Label>
              <Form.Control type="date" name="hasta" value={filtro.hasta} min={filtro.desde} onChange={cambiar} />
            </Form.Group>
          </Col>
          <Col xs={12} sm={2} md="auto">
            <Button type="submit" disabled={rangoInvalido}>Consultar</Button>
          </Col>
        </Row>
        {rangoInvalido && <p className="text-danger small mt-2">La fecha inicial debe ser anterior o igual a la final.</p>}
      </Form>

      {cargando && <Cargando texto="Calculando reporte..." />}
      {error && <Alert variant="danger">{error}</Alert>}

      {datos && (
        <>
          <Row className="g-3 mb-4">
            <Col xs={12} sm={4}>
              <div className="card text-center h-100"><div className="card-body">
                <p className="text-muted mb-1">Atenciones</p>
                <p className="h3 mb-0">{totalAtenciones}</p>
              </div></div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="card text-center h-100"><div className="card-body">
                <p className="text-muted mb-1">Pacientes nuevos</p>
                <p className="h3 mb-0">{datos.pacientesNuevos}</p>
              </div></div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="card text-center h-100"><div className="card-body">
                <p className="text-muted mb-1">Ingresos estimados</p>
                <p className="h3 mb-0">{pesos(totalIngresos)}</p>
              </div></div>
            </Col>
          </Row>

          <section aria-labelledby="titulo-atenciones">
            <h2 id="titulo-atenciones" className="h4">Atenciones por servicio</h2>
            <div className="table-responsive">
              <table className="table table-bordered table-hover mt-3">
                <caption>
                  Citas confirmadas entre el {formatearFecha(periodo.desde)} y el {formatearFecha(periodo.hasta)}
                </caption>
                <thead className="table-success">
                  <tr>
                    <th scope="col">Servicio</th>
                    <th scope="col">Atenciones</th>
                    <th scope="col">Ingresos (CLP)</th>
                  </tr>
                </thead>
                <tbody>
                  {porServicio.length === 0 && (
                    <tr><td colSpan={3} className="text-center text-muted py-3">No hay atenciones en este período.</td></tr>
                  )}
                  {porServicio.map((r) => (
                    <tr key={r.servicio}>
                      <td>{r.servicio}</td>
                      <td>{r.atenciones}</td>
                      <td>{pesos(r.total)}</td>
                    </tr>
                  ))}
                  {porServicio.length > 0 && (
                    <tr>
                      <th scope="row">Total</th>
                      <th>{totalAtenciones}</th>
                      <th>{pesos(totalIngresos)}</th>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default AdminReportes;
