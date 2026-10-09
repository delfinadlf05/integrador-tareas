const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  completada: { type: Boolean, default: false },
  fechaCompletada: { type: Date, default: null },
  prioridad: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true });

module.exports = mongoose.model('Tarea', tareaSchema);
