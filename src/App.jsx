import { Routes, Route } from 'react-router-dom'
import Navegacion from './components/Navegacion'
import PiePagina from './components/PiePagina'
import RutaProtegida from './components/RutaProtegida'
import { useAuth } from './context/AuthContext'
import { esPersonal } from './utils/roles'
import Inicio from './pages/Inicio.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Servicios from './pages/Servicios.jsx'
import DetalleServicio from './pages/DetalleServicio.jsx'
import Agenda from './pages/Agenda.jsx'
import Recursos from './pages/Recursos.jsx'
import Citas from './pages/cliente/Citas'
import Ingreso from './pages/auth/Ingreso'
import Registro from './pages/auth/Registro'
import NoEncontrada from './pages/NoEncontrada.jsx'
import MiCuenta from './pages/cliente/MiCuenta'
import AdminServicios from './pages/admin/AdminServicios'
import AdminCitas from './pages/admin/AdminCitas'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminReportes from './pages/admin/AdminReportes'
import AdminHistorial from './pages/admin/AdminHistorial'
import DetalleFicha from './pages/admin/DetalleFicha'
import RecepcionCitas from './pages/recepcionista/RecepcionCitas'
import RecepcionFichas from './pages/recepcionista/RecepcionFichas'

function App() {
    const { sesion } = useAuth()

    return (
        <>
            <Navegacion />
            <Routes>
                {/* Información pública de la clínica: se ve sin cuenta */}
                <Route path="/"              element={<Inicio />} />
                <Route path="/nosotros"      element={<Nosotros />} />
                <Route path="/servicios"     element={<Servicios />} />
                <Route path="/servicios/:id" element={<DetalleServicio />} />
                <Route path="/agenda"        element={<Agenda />} />
                <Route path="/recursos"      element={<Recursos />} />
                <Route path="/ingreso"       element={<Ingreso />} />
                <Route path="/registro"      element={<Registro />} />

                {/* Solicitar hora y todo lo demás exige iniciar sesión */}
                <Route element={<RutaProtegida />}>
                    <Route element={<RutaProtegida roles={['CLIENTE']} />}>
                        <Route path="/citas"     element={<Citas />} />
                        <Route path="/mi-cuenta" element={<MiCuenta />} />
                    </Route>

                    <Route element={<RutaProtegida roles={['ADMIN', 'RECEPCIONISTA']} />}>
                        <Route path="/recepcion/citas"  element={<RecepcionCitas />} />
                        <Route path="/recepcion/fichas" element={<RecepcionFichas />} />
                    </Route>

                    <Route element={<RutaProtegida roles={['ADMIN']} />}>
                        <Route path="/admin/servicios"     element={<AdminServicios />} />
                        <Route path="/admin/citas"         element={<AdminCitas />} />
                        <Route path="/admin/usuarios"      element={<AdminUsuarios />} />
                        <Route path="/admin/reportes"      element={<AdminReportes />} />
                        <Route path="/admin/historial"     element={<AdminHistorial />} />
                        <Route path="/admin/historial/:id" element={<DetalleFicha />} />
                    </Route>
                </Route>

                <Route path="*" element={<NoEncontrada />} />
            </Routes>
            <PiePagina esAdmin={esPersonal(sesion?.rol)} />
        </>
    )
}

export default App
