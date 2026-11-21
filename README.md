# Veterinaria San Marcos - Frontend

SPA en React para la Evaluación Parcial 3 de DSY1104 Desarrollo FullStack II.
Consume dos microservicios Spring Boot mediante API REST / JSON:

| Microservicio | Responsabilidad | URL local |
|---|---|---|
| `veterinaria-auth` | Usuarios, login, registro y emisión/renovación del JWT | `http://localhost:8081/api/v1` |
| `veterinaria-san-marcos-backend` | Servicios, citas, pacientes, fichas y reportes | `http://localhost:8082/api/v1` |

## Ejecutar

Requiere Node.js 20 o superior y ambos backends en ejecución.

```bash
npm install
npm run dev
```

La aplicación abre en http://localhost:5173. Las URL de las API se configuran en `.env.development` (ver `.env.example`).

## Sesión y roles

- El login (`POST /auth/login`) devuelve un JWT. Se guarda en `sessionStorage` junto con correo, nombre y rol; nunca la contraseña.
- `AuthContext` restaura la sesión al recargar la página, la cierra si el token venció y la renueva 5 minutos antes de vencer (`POST /auth/renovar`).
- Toda petición envía `Authorization: Bearer <token>`. Una respuesta 401 cierra la sesión y lleva al ingreso.
- `RutaProtegida` impide entrar a vistas sin sesión o sin el rol requerido. Solo `/ingreso` y `/registro` son públicas, según la regla de seguridad del caso.

| Código de rol (claim `rol`) | Rol del caso | Vistas |
|---|---|---|
| `ADMIN` | Administrador | Todas: servicios, citas, fichas, pacientes, usuarios, reportes |
| `RECEPCIONISTA` | Recepcionista | Citas (confirmar y reagendar) y fichas (registrar y editar) |
| `CLIENTE` | Dueño de mascota | Sitio, solicitar hora, Mi cuenta (sus citas, historial y avisos de vacuna) |

## Contrato esperado del backend

Errores: cuerpo JSON `{"error": "mensaje"}` (o `{"mensaje": "..."}` en Auth). El frontend muestra ese texto.
Fechas: `LocalDate` como `"2026-12-01"`; horas como `"10:00"`.

### Auth (8081)

| Método | Ruta | Rol | Cuerpo | Respuesta |
|---|---|---|---|---|
| POST | `/auth/login` | público | `{correo, password}` | `{token, correo, nombre, rol}` |
| POST | `/auth/registro` | público | `{nombre, correo, telefono, password}` | igual que login; rol siempre `CLIENTE` |
| POST | `/auth/renovar` | token válido | — | igual que login, con token nuevo |
| GET | `/usuarios` | ADMIN | — | `[{id, nombre, correo, telefono, rol, activo}]` (sin contraseña) |
| POST | `/usuarios` | ADMIN | `{nombre, correo, telefono, rol, password}` | usuario creado |
| PUT | `/usuarios/{id}` | ADMIN | uno o más de `{nombre, telefono, rol, activo}` | usuario actualizado |

El JWT debe incluir `sub` (correo), `rol` y `exp`. Un usuario con `activo: false` no puede iniciar sesión.

### Clínica (8082)

| Método | Ruta | Rol | Cuerpo / parámetros | Respuesta |
|---|---|---|---|---|
| GET | `/servicios`, `/servicios/{id}` | autenticado | — | `Servicio` |
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

CORS: ambos backends deben permitir el origen `http://localhost:5173`, los métodos usados y los encabezados `Content-Type` y `Authorization`.
