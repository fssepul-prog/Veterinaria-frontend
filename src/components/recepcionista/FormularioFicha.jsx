import { useState } from "react"
import { Button, Form, Row, Col } from "react-bootstrap"
import { hoyIso } from "../../utils/formato"

const vacia = {
  pacienteId: "", fecha: "", motivo: "", diagnostico: "",
  medicamento: "", vacuna: "", proximaVacuna: "", proximoControl: "",
}

function desdeFicha(ficha) {
  if (!ficha) return vacia
  return {
    pacienteId: String(ficha.paciente.id),
    fecha: ficha.fecha ?? "",
    motivo: ficha.motivo ?? "",
    diagnostico: ficha.diagnostico ?? "",
    medicamento: ficha.medicamento ?? "",
    vacuna: ficha.vacuna ?? "",
    proximaVacuna: ficha.proximaVacuna ?? "",
    proximoControl: ficha.proximoControl ?? "",
  }
}

function FormularioFicha({ ficha, pacientes, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(() => desdeFicha(ficha))
  const [aviso, setAviso] = useState("")

  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  async function enviar(evento) {
    evento.preventDefault()
    if (!datos.pacienteId || !datos.fecha || !datos.motivo.trim() || !datos.diagnostico.trim()) {
      setAviso("Paciente, fecha, motivo y diagnóstico son obligatorios.")
      return
    }
    setAviso("")
    const { pacienteId, ...resto } = datos
    // Las fechas opcionales vacías se envían como null para que el backend no reciba ""
    const cuerpo = {
      ...resto,
      paciente: { id: Number(pacienteId) },
      proximaVacuna: resto.proximaVacuna || null,
      proximoControl: resto.proximoControl || null,
    }
    if (await onGuardar(cuerpo) && !ficha) setDatos(vacia)
  }

  return (
    <Form onSubmit={enviar} noValidate>
      {aviso && <p className="text-danger small">{aviso}</p>}

      <Form.Group className="mb-3" controlId={`ficha-paciente-${ficha?.id ?? "nueva"}`}>
        <Form.Label>Paciente</Form.Label>
        <Form.Select name="pacienteId" value={datos.pacienteId} onChange={cambiar}>
          <option value="">Selecciona la mascota...</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre} ({p.especie}) · {p.nombreDueno}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId={`ficha-fecha-${ficha?.id ?? "nueva"}`}>
        <Form.Label>Fecha de atención</Form.Label>
        <Form.Control type="date" name="fecha" max={hoyIso()} value={datos.fecha} onChange={cambiar} />
      </Form.Group>

      <Form.Group className="mb-3" controlId={`ficha-motivo-${ficha?.id ?? "nueva"}`}>
        <Form.Label>Motivo</Form.Label>
        <Form.Control name="motivo" value={datos.motivo} onChange={cambiar} />
      </Form.Group>

      <Form.Group className="mb-3" controlId={`ficha-diagnostico-${ficha?.id ?? "nueva"}`}>
        <Form.Label>Diagnóstico</Form.Label>
        <Form.Control as="textarea" rows={2} name="diagnostico" value={datos.diagnostico} onChange={cambiar} />
      </Form.Group>

      <Form.Group className="mb-3" controlId={`ficha-medicamento-${ficha?.id ?? "nueva"}`}>
        <Form.Label>Medicamento recetado (opcional)</Form.Label>
        <Form.Control name="medicamento" value={datos.medicamento} onChange={cambiar} />
      </Form.Group>

      <Row>
        <Col xs={12} sm={6}>
          <Form.Group className="mb-3" controlId={`ficha-vacuna-${ficha?.id ?? "nueva"}`}>
            <Form.Label>Vacuna aplicada (opcional)</Form.Label>
            <Form.Control name="vacuna" value={datos.vacuna} onChange={cambiar} />
          </Form.Group>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Group className="mb-3" controlId={`ficha-proxima-vacuna-${ficha?.id ?? "nueva"}`}>
            <Form.Label>Próxima dosis</Form.Label>
            <Form.Control type="date" name="proximaVacuna" value={datos.proximaVacuna} onChange={cambiar} />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId={`ficha-control-${ficha?.id ?? "nueva"}`}>
        <Form.Label>Próximo control (opcional)</Form.Label>
        <Form.Control type="date" name="proximoControl" value={datos.proximoControl} onChange={cambiar} />
      </Form.Group>

      <Button type="submit" className="me-2">Guardar</Button>
      {onCancelar && <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>}
    </Form>
  )
}

export default FormularioFicha
