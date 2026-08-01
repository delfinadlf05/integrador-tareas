const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === process.env.TOKEN_SECRETO) {
    next();
  } else {
    res.status(403).json({ mensaje: "Acceso prohibido: Token inválido" });
  }
};

module.exports = authMiddleware;