# integrador-tareas

API RESTful desarrollada en Node.js, Express y MongoDB para la gestión y persistencia de usuarios y tareas.


## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework para el servidor backend y enrutamiento.
- **MongoDB & Mongoose**: Base de datos NoSQL y ODM para el modelado de datos.
- **Thunder Client**: Herramienta de pruebas para consumir la API.
- **Dotenv**: Gestión de variables de entorno.


## Estructura del Proyecto

```text
integrador-tareas/
├── docs/
│   ├── coleccion-postman.json
|   ├── registrar_usuario/
│   ├── crear_tarea/
│   ├── obtener_tarea/
|   ├── actualizar_tarea/
│   └── eliminar_tarea/
├── node_modules/
├── src/
|   ├── config/
│   ├── controllers/
|   ├── middleware/
│   ├── models/
|   ├── repositories/
│   ├── routes/
|   ├── utils/
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── vercel.json

## Endpoints

Todos cuelgan de `/api/tareas`.

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | `/api/tareas` | Lista tareas. Filtros opcionales: `?prioridad=alta&completada=false&q=texto` |
| POST | `/api/tareas` | Crea una tarea (requiere el token en el header `Authorization`) |
| PUT | `/api/tareas/:id` | Actualiza una tarea |
| DELETE | `/api/tareas/:id` | Elimina una tarea |
| PUT | `/api/tareas/:id/completar` | Marca la tarea como completada y guarda la fecha. Si ya estaba completada responde 409 |
| PUT | `/api/tareas/:id/reabrir` | Vuelve la tarea a pendiente. Si no estaba completada responde 409 |
| GET | `/api/tareas/resumen` | Totales: total, completadas, pendientes, pendientes de prioridad alta y cantidad por prioridad |
| POST | `/api/auth/register` | Registra un usuario (contraseña hasheada con bcrypt) |
| POST | `/api/auth/login` | Verifica las credenciales |

Los errores responden `{ "error": "mensaje" }` con su status (400, 404, 409).

## Frontend

El frontend en React que consume esta API está en el repositorio `landing-pilar-tecno`.
CORS está habilitado para `http://localhost:5173` (ver `src/config/corsConfig.js`).
