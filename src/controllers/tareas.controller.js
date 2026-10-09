const tareasService = require('../services/tareas.service');

const getTareas = async (req, res, next) => {
  try {
    const tareas = await tareasService.obtenerTodas(req.query);
    res.json(tareas);
  } catch (error) {
    next(error);
  }
};

const createTarea = async (req, res, next) => {
  try {
    const nuevaTarea = await tareasService.crearTarea(req.body);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
};

const updateTarea = async (req, res, next) => {
  try {
    const tareaActualizada = await tareasService.actualizarTarea(req.params.id, req.body);
    res.json(tareaActualizada);
  } catch (error) {
    next(error);
  }
};

const deleteTarea = async (req, res, next) => {
  try {
    await tareasService.eliminarTarea(req.params.id);
    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

const completarTarea = async (req, res, next) => {
  try {
    const tarea = await tareasService.completarTarea(req.params.id);
    res.json(tarea);
  } catch (error) {
    next(error);
  }
};

const reabrirTarea = async (req, res, next) => {
  try {
    const tarea = await tareasService.reabrirTarea(req.params.id);
    res.json(tarea);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTareas,
  createTarea,
  updateTarea,
  deleteTarea,
  completarTarea,
  reabrirTarea
};
