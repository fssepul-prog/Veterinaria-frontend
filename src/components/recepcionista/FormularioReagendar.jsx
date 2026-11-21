import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { hoyIso } from "../../utils/formato"

function FormularioReagendar({ cita, ocupado, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({ fecha: cita.fecha, hora: cita.hora })

  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  function enviar(evento) {
    evento.preventDefault()
    onGuardar(cita.id, datos.fecha, datos.hora)
  }

  return (
    <article className="card h-100">
      <div className="card-body">
        <h2 className="h5">Proponer otro horario para {cita.mascota}</h2>
        <Form onSubmit={enviar}>
          <Form.Group className="mb-3" controlId={`fecha-${cita.id}`}>
            <Form.Label>Nueva fecha</Form.Label>
            <Form.Control type="date" name="fecha" min={hoyIso()} value={datos.fecha} onChange={cambiar} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId={`hora-${cita.id}`}>
            <Form.Label>Nueva hora</Form.Label>
            <Form.Control type="time" name="hora" value={datos.hora} onChange={cambiar} required />
          </Form.Group>

          <Button type="submit" className="me-2" disabled={ocupado}>Guardar</Button>
          <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>
        </Form>
      </div>
    </article>
  )
}

export default FormularioReagendar
