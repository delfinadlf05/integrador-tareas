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