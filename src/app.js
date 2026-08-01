require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const connectDB = require('./config/db');
const corsOptions = require('./config/corsConfig');
const tareasRoutes = require('./routes/tareas.routes');
const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares globales
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/tareas', tareasRoutes);
app.use('/api/auth', authRoutes);

// Middleware de manejo de errores
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;