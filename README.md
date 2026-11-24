# Veterinaria San Marcos - Frontend

SPA en React para la Evaluación Parcial 3 de DSY1104 Desarrollo FullStack II.
Consume dos microservicios Spring Boot mediante API REST / JSON.

- Aplicación publicada (AWS): http://52.21.218.157
- Backend: [Veterinaria-backend](https://github.com/fssepul-prog/Veterinaria-backend)
- Integrantes: Felipe Echeverría, Fabián Mondaca, Enrique Ignacio Gutiérrez Benítez

Tecnologías: React 18, Vite 5, React Router 7, React Bootstrap 2 y `fetch`.

| Microservicio | Responsabilidad | URL local |
|---|---|---|
| `veterinaria-auth` | Usuarios, login, registro y emisión/renovación del JWT | `http://localhost:8081/api/v1` |
| `veterinaria-san-marcos-backend` | Servicios, citas, pacientes, fichas y reportes | `http://localhost:8082/api/v1` |

## Ejecutar en local

Requiere Node.js 20 o superior y los dos backends en ejecución (ver el README del backend).

```bash
npm install
npm run dev
```

La aplicación abre en http://localhost:5173. Las URL de las API se configuran en `.env.development` (ver `.env.example`).

## Compilar para producción (AWS)

```bash
npm run build
```

El build usa `.env.production`, con rutas relativas que Nginx reenvía a cada microservicio:

| Variable | Valor | Nginx la reenvía a |
|---|---|---|
| `VITE_AUTH_API_URL` | `/api/auth-service/v1` | `127.0.0.1:8081/api/v1` |
| `VITE_API_URL` | `/api/clinica-service/v1` | `127.0.0.1:8082/api/v1` |

La carpeta `dist` se copia a `/var/www/veterinaria` en el servidor. Después de copiarla hay que dejar las carpetas en 755 y los archivos en 644; si Nginx no puede leer `assets`, la página queda en blanco.

## Estructura

| Carpeta | Contenido |
|---|---|
| `src/services` | `api.js` (fetch, token, manejo de errores) y un servicio por recurso: `authService`, `servicioService`, `citaService`, `pacienteService`, `fichaService`, `reporteService`, `usuarioService` |
| `src/context` | `AuthContext`: sesión, expiración y renovación del token |
| `src/components` | `RutaProtegida`, `Navegacion`, tarjetas y formularios |
| `src/pages` | Vistas públicas, `auth`, `cliente`, `recepcionista` y `admin` |
| `src/hooks` | `useCarga`: estados de carga y error de cada petición |
| `src/utils` | Roles, rutas de inicio por rol y formato de fechas y precios |

## Sesión y roles

- El login (`POST /auth/login`) devuelve un JWT. Se guarda en `sessionStorage` junto con correo, nombre y rol; nunca la contraseña.
- `AuthContext` restaura la sesión al recargar la página, la cierra si el token venció y la renueva 5 minutos antes de vencer (`POST /auth/renovar`).
- `api.js` envía `Authorization: Bearer <token>` en cada petición. Un 401 con token cierra la sesión; un 403 muestra «No tienes permisos para realizar esta acción.».
- `RutaProtegida` impide entrar a vistas sin sesión (envía a `/ingreso` y vuelve a la página pedida después del login) o sin el rol requerido (devuelve al inicio del rol).
- El menú y las acciones se adaptan al rol; por ejemplo, solo el administrador ve el botón para cancelar citas. El backend repite cada regla y responde 403.

Vistas públicas: `/`, `/nosotros`, `/servicios`, `/servicios/:id`, `/agenda`, `/recursos`, `/ingreso` y `/registro`. El catálogo se carga desde la API sin token.

| Código de rol (claim `rol`) | Rol del caso | Página de inicio | Vistas |
|---|---|---|---|
| `ADMIN` | Administrador | `/admin/servicios` | Todas: servicios, citas, fichas, pacientes, usuarios y reportes |
| `RECEPCIONISTA` | Recepcionista | `/recepcion/citas` | Citas (confirmar y reagendar) y fichas (pacientes y atenciones) |
| `CLIENTE` | Dueño de mascota | `/mi-cuenta` | Solicitar hora y Mi cuenta (sus citas, historial y avisos de vacuna) |

## Contrato con el backend

Errores: cuerpo JSON `{"error": "mensaje"}` (o `{"mensaje": "..."}` en autenticación). El frontend muestra ese texto.
Fechas: `"2026-12-01"`; horas: `"10:00"`.

### Autenticación (8081)

| Método | Ruta | Rol | Cuerpo | Respuesta |
|---|---|---|---|---|
| POST | `/auth/login` | público | `{correo, password}` | `{token, correo, nombre, rol}` |
| POST | `/auth/registro` | público | `{nombre, correo, telefono, password}` | igual que login; rol siempre `CLIENTE` |
| POST | `/auth/renovar` | token válido | — | igual que login, con token nuevo |
| GET | `/usuarios` | ADMIN | — | `[{id, nombre, correo, telefono, rol, activo}]` (sin contraseña) |
| POST | `/usuarios` | ADMIN | `{nombre, correo, telefono, rol, password}` | usuario creado |
| PUT | `/usuarios/{id}` | ADMIN | uno o más de `{nombre, telefono, rol, activo}` | usuario actualizado |

Un usuario con `activo: false` no puede iniciar sesión.

### Clínica (8082)

| Método | Ruta | Rol | Cuerpo / parámetros | Respuesta |
|---|---|---|---|---|
| GET | `/servicios`, `/servicios/{id}` | público | — | `Servicio` |
| POST · PUT · DELETE | `/servicios`, `/servicios/{id}` | ADMIN | `{codigo, nombre, categoria, descripcion, especie, duracion, precio}` | `Servicio` · 204 |
| GET | `/citas` | ADMIN, RECEPCIONISTA | — | `[Cita]` |
| GET | `/citas/mias` | CLIENTE | — | citas cuyo `correoCliente` es el del token |
| POST | `/citas` | CLIENTE | `{dueno, telefono, mascota, especie, servicio:{id}, fecha, hora, observaciones}` | `Cita` con estado `Pendiente` |
| PUT | `/citas/{id}/estado` | ADMIN, RECEPCIONISTA (`Cancelada` solo ADMIN) | `{estado}` | `Cita` |
| PUT | `/citas/{id}/reagendar` | ADMIN, RECEPCIONISTA | `{fecha, hora}` | `Cita` con estado `Reagendada` |
| GET · POST | `/pacientes`, `/pacientes/{id}` | ADMIN, RECEPCIONISTA | `{nombre, especie, nombreDueno, correoDueno}` | `Paciente` |
| GET | `/fichas?pacienteId={id}` | ADMIN, RECEPCIONISTA | `pacienteId` opcional | `[Ficha]` |
| GET | `/fichas/mias` | CLIENTE | — | fichas de pacientes cuyo `correoDueno` es el del token |
| POST · PUT | `/fichas`, `/fichas/{id}` | ADMIN, RECEPCIONISTA | `{paciente:{id}, fecha, motivo, diagnostico, medicamento, vacuna, proximaVacuna, proximoControl}` | `Ficha` |
| GET | `/reportes/atenciones?desde=&hasta=` | ADMIN | fechas ISO | `{porServicio:[{servicio, atenciones, total}], pacientesNuevos}` |

Formas de respuesta:

- `Servicio`: `{id, codigo, nombre, categoria, descripcion, especie, duracion, precio, imagen}`
- `Cita`: `{id, mascota, especie, dueno, correoCliente, telefono, servicio:{id, nombre, precio}, fecha, hora, observaciones, estado}`. Estados: `Pendiente`, `Confirmada`, `Reagendada`, `Cancelada`.
- `Paciente`: `{id, nombre, especie, nombreDueno, correoDueno}`
- `Ficha`: `{id, paciente:{id, nombre, especie, nombreDueno, correoDueno}, fecha, motivo, diagnostico, medicamento, vacuna, proximaVacuna, proximoControl}`

CORS (solo en local): los backends permiten el origen definido en `APP_CORS_ALLOWED_ORIGIN` (por defecto `http://localhost:5173`). En AWS la página y la API comparten origen a través de Nginx.
