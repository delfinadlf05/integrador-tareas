const tareasRepository = require('../repositories/tareas.repository');
const HttpError = require('../utils/HttpError');

const PRIORIDADES = ['baja', 'media', 'alta'];

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Arma el filtro de Mongo a partir de la query (?prioridad=&completada=&q=).
// Solo se aceptan estos tres filtros, validados: nada más llega a la base.
const construirFiltro = ({ prioridad, completada, q } = {}) => {
  const filtro = {};

  if (prioridad !== undefined && prioridad !== '') {
    if (!PRIORIDADES.includes(prioridad)) {
      throw new HttpError(400, "La prioridad debe ser baja, media o alta");
    }
    filtro.prioridad = prioridad;
  }

  if (completada !== undefined && completada !== '') {
    if (completada !== 'true' && completada !== 'false') {
      throw new HttpError(400, "El filtro completada debe ser true o false");
    }
    filtro.completada = completada === 'true';
  }

  if (q !== undefined && q !== '') {
    if (typeof q !== 'string') {
      throw new HttpError(400, "La búsqueda debe ser un texto");
    }
    if (q.trim() !== '') {
      filtro.titulo = { $regex: escaparRegex(q.trim()), $options: 'i' };
    }
  }

  return filtro;
};

const obtenerTodas = async (query) => {
  return await tareasRepository.findAll(construirFiltro(query));
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
