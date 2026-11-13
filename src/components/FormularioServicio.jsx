import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const inicial = { codigo: "", nombre: "", categoria: "", descripcion: "", especie: "", duracion: "", precio: "" };

function FormularioServicio({ servicioEditando, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(inicial);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    setDatos(servicioEditando ? { ...inicial, ...servicioEditando } : inicial);
    setAviso("");
  }, [servicioEditando]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (!datos.codigo.trim() || !datos.nombre.trim() || !datos.categoria || datos.precio === "") {
      setAviso("Código, nombre, categoría y precio son obligatorios.");
      return;
    }
    if (Number(datos.precio) < 0) {
      setAviso("El precio no puede ser negativo.");
      return;
    }
    setAviso("");
    if (await onGuardar({ ...datos, precio: Number(datos.precio) }) && !servicioEditando) setDatos(inicial);
  }

  return (
    <Form onSubmit={enviar} noValidate>
      {aviso && <p className="text-danger small">{aviso}</p>}

      <Form.Group className="mb-3" controlId="codigo">
        <Form.Label>Código</Form.Label>
        <Form.Control name="codigo" value={datos.codigo} onChange={cambiar} placeholder="Ej: SV013" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="categoria">
        <Form.Label>Categoría</Form.Label>
        <Form.Select name="categoria" value={datos.categoria} onChange={cambiar}>
          <option value="">Selecciona una categoría</option>
          <option>Consultas</option>
          <option>Vacunación</option>
          <option>Cirugía</option>
          <option>Desparasitación</option>
          <option>Exámenes</option>
          <option>Otros</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="descripcion">
        <Form.Label>Descripción</Form.Label>
        <Form.Control as="textarea" rows={2} name="descripcion" value={datos.descripcion} onChange={cambiar} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="especie">
        <Form.Label>Especie</Form.Label>
        <Form.Control name="especie" value={datos.especie} onChange={cambiar} placeholder="Ej: Perro / Gato" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="duracion">
        <Form.Label>Duración</Form.Label>
        <Form.Control name="duracion" value={datos.duracion} onChange={cambiar} placeholder="Ej: 30 min" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="precio">
        <Form.Label>Precio (CLP)</Form.Label>
        <Form.Control type="number" name="precio" min="0" value={datos.precio} onChange={cambiar} />
      </Form.Group>

      <Button type="submit" className="me-2">{servicioEditando ? "Guardar cambios" : "Crear servicio"}</Button>
      {onCancelar && (
        <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>
      )}
    </Form>
  );
}

export default FormularioServicio;
