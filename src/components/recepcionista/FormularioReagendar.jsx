import { useState } from "react"
import { Button, Form } from "react-bootstrap"

function FormularioReagendar({ cita, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({ fecha: cita.fecha })

  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  function enviar(evento) {
    evento.preventDefault()
    onGuardar(cita.id, datos.fecha)
  }

  return (
    <article className="card h-100">
      <div className="card-body">
        <h2 className="h5">Reagendar a {cita.mascota}</h2>
        <Form onSubmit={enviar} noValidate>
          <Form.Group className="mb-3" controlId="fecha">
            <Form.Label>Nueva fecha</Form.Label>
            <Form.Control
              name="fecha"
              value={datos.fecha}
              onChange={cambiar}
            />
          </Form.Group>

          <Button type="submit" className="me-2">Guardar</Button>
          <Button type="button" variant="secondary" onClick={() => onCancelar()}>Cancelar</Button>
        </Form>
      </div>
    </article>
  )
}

export default FormularioReagendar
