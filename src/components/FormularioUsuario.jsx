import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ROLES } from "../utils/roles";

const inicial = { nombre: "", correo: "", telefono: "", rol: "", password: "" };

function FormularioUsuario({ usuarioEditando, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(inicial);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    setDatos(usuarioEditando ? { ...inicial, ...usuarioEditando, password: "" } : inicial);
    setAviso("");
  }, [usuarioEditando]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (!datos.nombre.trim() || !datos.correo.trim() || !datos.rol) {
      setAviso("Nombre, correo y rol son obligatorios.");
      return;
    }
    if (!usuarioEditando && datos.password.length < 8) {
      setAviso("La contraseña inicial debe tener al menos 8 caracteres.");
      return;
    }
    setAviso("");
    const cuerpo = usuarioEditando
      ? { nombre: datos.nombre.trim(), telefono: datos.telefono, rol: datos.rol }
      : { nombre: datos.nombre.trim(), correo: datos.correo.trim(), telefono: datos.telefono, rol: datos.rol, password: datos.password };
    if (await onGuardar(cuerpo) && !usuarioEditando) setDatos(inicial);
  }

  return (
    <Form onSubmit={enviar} noValidate>
      {aviso && <p className="text-danger small">{aviso}</p>}

      <Form.Group className="mb-3" controlId="usuario-nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="usuario-correo">
        <Form.Label>Correo</Form.Label>
        <Form.Control type="email" name="correo" value={datos.correo} onChange={cambiar} disabled={!!usuarioEditando} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="usuario-telefono">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control name="telefono" value={datos.telefono ?? ""} onChange={cambiar} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="usuario-rol">
        <Form.Label>Rol</Form.Label>
        <Form.Select name="rol" value={datos.rol} onChange={cambiar}>
          <option value="">Selecciona un rol</option>
          {Object.entries(ROLES).map(([codigo, nombre]) => (
            <option key={codigo} value={codigo}>{nombre}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {!usuarioEditando && (
        <Form.Group className="mb-3" controlId="usuario-password">
          <Form.Label>Contraseña inicial</Form.Label>
          <Form.Control type="password" name="password" value={datos.password} onChange={cambiar} autoComplete="new-password" />
          <Form.Text>Mínimo 8 caracteres. Entrégala al usuario por un canal seguro.</Form.Text>
        </Form.Group>
      )}

      <Button type="submit" className="me-2">{usuarioEditando ? "Guardar cambios" : "Crear usuario"}</Button>
      {onCancelar && <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>}
    </Form>
  );
}

export default FormularioUsuario;
