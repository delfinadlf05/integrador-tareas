const bcrypt = require('bcrypt');
const usuarioRepository = require('../repositories/usuario.repository');
const HttpError = require('../utils/HttpError');

const registrar = async ({ nombre, email, password }) => {
  if (!nombre || !email || !password) {
    throw new HttpError(400, "Faltan datos obligatorios");
  }
  const existe = await usuarioRepository.findByEmail(email);
  if (existe) {
    throw new HttpError(400, "El email ya está registrado");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  return await usuarioRepository.create({ nombre, email, password: hashPassword });
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new HttpError(400, "Faltan datos obligatorios");
  }
  const usuario = await usuarioRepository.findByEmail(email);
  if (!usuario) {
    throw new HttpError(401, "Credenciales inválidas");
  }
  const coincide = await bcrypt.compare(password, usuario.password);
  if (!coincide) {
    throw new HttpError(401, "Credenciales inválidas");
  }
  return { mensaje: "Login correcto", usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email } };
};

module.exports = { registrar, login };