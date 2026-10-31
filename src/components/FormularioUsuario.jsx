import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const inicial = { nombre: "", correo: "", telefono: "", rol: "", activo: true };

function FormularioUsuario({ onGuardar }) {
  const [datos, setDatos] = useState(inicial);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();
    onGuardar(datos);
    setDatos(inicial);
  }

  return (
    <Form onSubmit={enviar} noValidate>
      <Form.Group className="mb-3" controlId="nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="nombre"
          value={datos.nombre}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="correo">
        <Form.Label>Correo</Form.Label>
        <Form.Control
          name="correo"
          value={datos.correo}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="telefono">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          name="telefono"
          value={datos.telefono}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="rol">
        <Form.Label>Rol</Form.Label>
        <Form.Select
          name="rol"
          value={datos.rol}
          onChange={cambiar}
        >
          <option value="">Selecciona un rol</option>
          <option>Administrador</option>
          <option>Recepcionista</option>
          <option>Dueño de mascota</option>
        </Form.Select>
      </Form.Group>

      <Button type="submit">Guardar</Button>
    </Form>
  );
}

export default FormularioUsuario;
