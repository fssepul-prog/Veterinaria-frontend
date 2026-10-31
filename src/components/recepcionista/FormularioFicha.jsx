import { useState } from "react"
import { Button, Form } from "react-bootstrap"

function FormularioFicha({ ficha, onGuardar }) {
  const [datos, setDatos] = useState(ficha)

  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  function enviar(evento) {
    evento.preventDefault()
    onGuardar(datos)
    setDatos(ficha)
  }

  return (
    <Form onSubmit={enviar} noValidate>
      <Form.Group className="mb-3" controlId="dueno">
        <Form.Label>Dueño</Form.Label>
        <Form.Control
          name="dueno"
          value={datos.dueno}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="mascota">
        <Form.Label>Mascota</Form.Label>
        <Form.Control
          name="mascota"
          value={datos.mascota}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="fecha">
        <Form.Label>Fecha (DD-MM-AAAA)</Form.Label>
        <Form.Control
          name="fecha"
          value={datos.fecha}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="motivo">
        <Form.Label>Motivo</Form.Label>
        <Form.Control
          name="motivo"
          value={datos.motivo}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="diagnostico">
        <Form.Label>Diagnóstico</Form.Label>
        <Form.Control
          name="diagnostico"
          value={datos.diagnostico}
          onChange={cambiar}
        />
      </Form.Group>

      <Button type="submit">Guardar</Button>
    </Form>
  )
}

export default FormularioFicha
