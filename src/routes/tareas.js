const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea');

// 1. Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener tareas", error: error.message });
  }
});

// 2. Obtener una tarea por ID
router.get('/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la tarea", error: error.message });
  }
});

// 3. Crear una nueva tarea
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, fechaLimite, prioridad } = req.body;
    if (!titulo) {
      return res.status(400).json({ mensaje: "El título es obligatorio" });
    }

    const nuevaTarea = new Tarea({
      titulo,
      descripcion,
      fechaLimite,
      prioridad
    });

    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear la tarea", error: error.message });
  }
});

// 4. Actualizar una tarea por ID
router.put('/:id', async (req, res) => {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tareaActualizada) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar la tarea", error: error.message });
  }
});

// 5. Eliminar una tarea por ID
router.delete('/:id', async (req, res) => {
  try {
    const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
    if (!tareaEliminada) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la tarea", error: error.message });
  }
});

// ==========================================
// ENDPOINTS DE NEGOCIO
// ==========================================

// Marcar tarea como completada
router.put('/:id/completar', async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    tarea.completada = true;
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al marcar como completada", error: error.message });
  }
});

// Filtrar tareas por prioridad (alta, media, baja)
router.get('/prioridad/:nivel', async (req, res) => {
  try {
    const { nivel } = req.params;
    const tareas = await Tarea.find({ prioridad: nivel });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al filtrar por prioridad", error: error.message });
  }
});

module.exports = router;