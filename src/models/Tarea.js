const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  fechaLimite: {
    type: Date
  },
  completada: {
    type: Boolean,
    default: false
  },
  prioridad: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tarea', tareaSchema);