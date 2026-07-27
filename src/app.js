require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const tareasRoutes = require('./routes/tareas');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/integrador_tareas';

// Middleware para entender JSON
app.use(express.json());

// Rutas
app.use('/api/tareas', tareasRoutes);

// Ruta principal de bienvenida
app.get('/', (req, res) => {
  res.send('API de Integrador - Lista de Tareas funcionando correctamente');
});

// Conexión a MongoDB e inicio del servidor
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado exitosamente a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message);
  });