import { useState } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import FormularioUsuario from "../../components/FormularioUsuario";
import Cargando from "../../components/Cargando";
import { useAuth } from "../../context/AuthContext";
import { useCarga } from "../../hooks/useCarga";
import { actualizarUsuario, crearUsuario, listarUsuarios } from "../../services/usuarioService";
import { ROLES } from "../../utils/roles";

function AdminUsuarios() {
  const { sesion } = useAuth();
  const [editando, setEditando] = useState(null);
  const { datos, setDatos, cargando, error, setError } = useCarga(listarUsuarios);
  const usuarios = datos ?? [];

  function reemplazar(actualizado) {
    setDatos((actual) => actual.map((u) => (u.id === actualizado.id ? actualizado : u)));
  }

  async function guardar(cuerpo) {
    setError("");
    try {
      if (editando) {
        reemplazar(await actualizarUsuario(editando.id, cuerpo));
        setEditando(null);
      } else {
        const creado = await crearUsuario(cuerpo);
        setDatos((actual) => [...actual, creado]);
      }
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function cambiar(id, cambios) {
    setError("");
    try {
      reemplazar(await actualizarUsuario(id, cambios));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4">Gestión de usuarios</h1>

      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

      <Row className="g-4">
        <Col xs={12} lg={8}>
          {cargando ? <Cargando texto="Cargando usuarios..." /> : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <caption>Usuarios del sistema</caption>
                <thead className="table-success">
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Rol</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => {
                    // Evita que el administrador se quite el acceso a sí mismo
                    const esPropio = usuario.correo === sesion.correo;
                    return (
                      <tr key={usuario.id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.correo}</td>
                        <td>
                          <Form.Select
                            aria-label={`Rol de ${usuario.nombre}`}
                            value={usuario.rol}
                            disabled={esPropio}
                            onChange={(evento) => cambiar(usuario.id, { rol: evento.target.value })}
                          >
                            {Object.entries(ROLES).map(([codigo, nombre]) => (
                              <option key={codigo} value={codigo}>{nombre}</option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>
                          <span className={`badge ${usuario.activo ? "bg-success" : "bg-secondary"}`}>
                            {usuario.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            <button className="btn btn-outline-success btn-sm" onClick={() => setEditando(usuario)}>
                              Editar
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              disabled={esPropio}
                              onClick={() => cambiar(usuario.id, { activo: !usuario.activo })}
                            >
                              {usuario.activo ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Col>

        <Col xs={12} lg={4}>
          <h2 className="h5">{editando ? `Editar a ${editando.nombre}` : "Nuevo usuario"}</h2>
          <FormularioUsuario
            usuarioEditando={editando}
            onGuardar={guardar}
            onCancelar={editando ? () => setEditando(null) : undefined}
          />
        </Col>
      </Row>
    </main>
  );
}

export default AdminUsuarios;
