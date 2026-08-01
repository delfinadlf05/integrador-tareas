const Tarea = require('../models/Tarea');

const findAll = async (filtro = {}) => await Tarea.find(filtro);
const findById = async (id) => await Tarea.findById(id);
const create = async (data) => await Tarea.create(data);
const update = async (id, data) => await Tarea.findByIdAndUpdate(id, data, { new: true });
const deleteById = async (id) => await Tarea.findByIdAndDelete(id);

module.exports = { findAll, findById, create, update, deleteById };