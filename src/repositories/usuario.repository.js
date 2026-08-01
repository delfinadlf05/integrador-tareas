const Usuario = require('../models/Usuario');

const findByEmail = async (email) => await Usuario.findOne({ email });
const create = async (data) => await Usuario.create(data);

module.exports = { findByEmail, create };