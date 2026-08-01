const tareasRepository = require('../repositories/tareas.repository');
const HttpError = require('../utils/HttpError');

const obtenerTodas = async (filtro) => {
  return await tareasRepository.findAll(filtro);
};

const crearTarea = async (data) => {
  if (!data.titulo) {
    throw new HttpError(400, "El título de la tarea es obligatorio");
  }
  return await tareasRepository.create(data);
};

const actualizarTarea = async (id, data) => {
  const tarea = await tareasRepository.findById(id);
  if (!tarea) {
    throw new HttpError(404, "Tarea no encontrada");
  }
  return await tareasRepository.update(id, data);
};

const eliminarTarea = async (id) => {
  const tarea = await tareasRepository.findById(id);
  if (!tarea) {
    throw new HttpError(404, "Tarea no encontrada");
  }
  return await tareasRepository.deleteById(id);
};

module.exports = { obtenerTodas, crearTarea, actualizarTarea, eliminarTarea };