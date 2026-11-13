import { useState } from "react"
import { Button, Form } from "react-bootstrap"

const inicial = { nombre: "", especie: "", nombreDueno: "", correoDueno: "" }

function FormularioPaciente({ onGuardar }) {
  const [datos, setDatos] = useState(inicial)
  const [aviso, setAviso] = useState("")

  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  async function enviar(evento) {
    evento.preventDefault()
    if (Object.values(datos).some((v) => !v.trim())) {
      setAviso("Completa todos los campos.")
      return
    }
    setAviso("")
    if (await onGuardar(datos)) setDatos(inicial)
  }

  return (
    <Form onSubmit={enviar} noValidate>
      {aviso && <p className="text-danger small">{aviso}</p>}
      <Form.Group className="mb-3" controlId="paciente-nombre">
        <Form.Label>Nombre de la mascota</Form.Label>
        <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="paciente-especie">
        <Form.Label>Especie</Form.Label>
        <Form.Select name="especie" value={datos.especie} onChange={cambiar}>
          <option value="">Selecciona...</option>
          <option>Perro</option>
          <option>Gato</option>
          <option>Conejo</option>
          <option>Ave</option>
          <option>Otro</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="paciente-dueno">
        <Form.Label>Nombre del dueño</Form.Label>
        <Form.Control name="nombreDueno" value={datos.nombreDueno} onChange={cambiar} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="paciente-correo">
        <Form.Label>Correo del dueño</Form.Label>
        <Form.Control type="email" name="correoDueno" value={datos.correoDueno} onChange={cambiar} />
        <Form.Text>Debe ser el correo con que el dueño se registró, para que vea el historial en su cuenta.</Form.Text>
      </Form.Group>
      <Button type="submit" variant="outline-success">Registrar mascota</Button>
    </Form>
  )
}

export default FormularioPaciente
