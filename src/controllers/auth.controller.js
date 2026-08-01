const authService = require('../services/auth.service');

const registrar = async (req, res, next) => {
  try {
    const nuevoUsuario = await authService.registrar(req.body);
    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const respuesta = await authService.login(req.body);
    res.json(respuesta);
  } catch (error) {
    next(error);
  }
};

module.exports = { registrar, login };