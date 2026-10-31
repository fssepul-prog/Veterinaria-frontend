import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const inicial = { codigo: "", nombre: "", categoria: "", duracion: "", precio: "" };

function FormularioServicio({ servicioEditando, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(inicial);

  useEffect(() => {
    setDatos(servicioEditando || inicial);
  }, [servicioEditando]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();
    // convierte a número antes de enviar al padre para permitir formateo con toLocaleString
    onGuardar({ ...datos, precio: Number(datos.precio) });
    setDatos(inicial);
  }

  return (
    <Form onSubmit={enviar} noValidate>
      <Form.Group className="mb-3" controlId="codigo">
        <Form.Label>Código</Form.Label>
        <Form.Control
          name="codigo"
          value={datos.codigo}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="nombre"
          value={datos.nombre}
          onChange={cambiar}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="categoria">
        <Form.Label>Categoría</Form.Label>
        <Form.Select
          name="categoria"
          value={datos.categoria}
          onChange={cambiar}
        >
          <option value="">Selecciona una categoría</option>
          <option>Consultas</option>
          <option>Vacunación</option>
          <option>Cirugía</option>
          <option>Desparasitación</option>
          <option>Exámenes</option>
          <option>Otros</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="duracion">
        <Form.Label>Duración</Form.Label>
        <Form.Control
          name="duracion"
          value={datos.duracion}
          onChange={cambiar}
          placeholder="Ej: 30 min"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="precio">
        <Form.Label>Precio (CLP)</Form.Label>
        <Form.Control
          type="number"
          name="precio"
          min="0"
          value={datos.precio}
          onChange={cambiar}
        />
      </Form.Group>

      <Button type="submit" className="me-2">Guardar</Button>
      {onCancelar && (
        <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>
      )}
    </Form>
  );
}

export default FormularioServicio;
