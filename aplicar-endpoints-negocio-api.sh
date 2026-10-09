#!/usr/bin/env bash
# API integrador-tareas · endpoints de negocio para el Entregable Final de React
# Se ejecuta UNA vez, dentro de la carpeta integrador-tareas (en Git Bash):
#     bash aplicar-endpoints-negocio-api.sh
set -e

[ -f package.json ] && [ -f src/app.js ] && grep -q '"integrador-tareas"' package.json || { echo "ERROR: ejecutá este script dentro de la carpeta integrador-tareas"; exit 1; }
git diff --quiet && git diff --cached --quiet || { echo "ERROR: tenés cambios sin commitear. Hacé commit o git stash y reintentá."; exit 1; }
git checkout -q main
git rev-parse --verify -q feature/endpoints-negocio >/dev/null && { echo "ERROR: ya existe la rama feature/endpoints-negocio."; exit 1; }

w(){ mkdir -p "$(dirname "$1")"; cat > "$1"; }
git checkout -q -b feature/endpoints-negocio

# ---------------------------------------------------------------- 1 · modelo
w src/models/Tarea.js <<'EOF'
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
EOF
git add . && git commit -q -m "feat: agregar fecha de completado al modelo de tarea"

# ---------------------------------------------------------------- 2 · filtros validados
w src/repositories/tareas.repository.js <<'EOF'
const Tarea = require('../models/Tarea');

const findAll = async (filtro = {}) => await Tarea.find(filtro).sort({ createdAt: -1 });
const findById = async (id) => await Tarea.findById(id);
const create = async (data) => await Tarea.create(data);
const update = async (id, data) => await Tarea.findByIdAndUpdate(id, data, { new: true });
const deleteById = async (id) => await Tarea.findByIdAndDelete(id);

module.exports = { findAll, findById, create, update, deleteById };
EOF
w src/services/tareas.service.js <<'EOF'
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
EOF
git add . && git commit -q -m "feat: agregar filtros validados por prioridad, estado y titulo en el listado"

# ---------------------------------------------------------------- 3 · completar y reabrir
cat > src/services/tareas.service.js <<'EOF'
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

// ---- Reglas de negocio ----

// Una tarea solo se puede completar una vez: se guarda cuándo se completó.
const completarTarea = async (id) => {
  const tarea = await tareasRepository.findById(id);
  if (!tarea) {
    throw new HttpError(404, "Tarea no encontrada");
  }
  if (tarea.completada) {
    throw new HttpError(409, "La tarea ya está completada");
  }
  return await tareasRepository.update(id, {
    completada: true,
    fechaCompletada: new Date()
  });
};

// Solo se puede reabrir una tarea que estaba completada.
const reabrirTarea = async (id) => {
  const tarea = await tareasRepository.findById(id);
  if (!tarea) {
    throw new HttpError(404, "Tarea no encontrada");
  }
  if (!tarea.completada) {
    throw new HttpError(409, "La tarea todavía no está completada");
  }
  return await tareasRepository.update(id, {
    completada: false,
    fechaCompletada: null
  });
};

module.exports = {
  obtenerTodas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  completarTarea,
  reabrirTarea
};
EOF
cat > src/controllers/tareas.controller.js <<'EOF'
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
EOF
cat > src/routes/tareas.routes.js <<'EOF'
const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', tareasController.getTareas);
router.post('/', authMiddleware, tareasController.createTarea);

// Endpoints de negocio (van antes de '/:id' para que no se confundan con un id)
router.put('/:id/completar', tareasController.completarTarea);
router.put('/:id/reabrir', tareasController.reabrirTarea);

router.put('/:id', tareasController.updateTarea);
router.delete('/:id', tareasController.deleteTarea);

module.exports = router;
EOF
git add . && git commit -q -m "feat: agregar endpoints para completar y reabrir tareas"

# ---------------------------------------------------------------- 4 · resumen
cat > src/repositories/tareas.repository.js <<'EOF'
const Tarea = require('../models/Tarea');

const findAll = async (filtro = {}) => await Tarea.find(filtro).sort({ createdAt: -1 });
const findById = async (id) => await Tarea.findById(id);
const create = async (data) => await Tarea.create(data);
const update = async (id, data) => await Tarea.findByIdAndUpdate(id, data, { new: true });
const deleteById = async (id) => await Tarea.findByIdAndDelete(id);
const count = async (filtro = {}) => await Tarea.countDocuments(filtro);
const countByPrioridad = async () =>
  await Tarea.aggregate([{ $group: { _id: '$prioridad', total: { $sum: 1 } } }]);

module.exports = { findAll, findById, create, update, deleteById, count, countByPrioridad };
EOF
node -e '
const fs=require("fs");
let s=fs.readFileSync("src/services/tareas.service.js","utf8");
s=s.replace("module.exports = {\n  obtenerTodas,",`// Números para el panel de resumen de la interfaz.
const obtenerResumen = async () => {
  const [total, completadas, pendientesAlta, porPrioridad] = await Promise.all([
    tareasRepository.count({}),
    tareasRepository.count({ completada: true }),
    tareasRepository.count({ completada: false, prioridad: "alta" }),
    tareasRepository.countByPrioridad()
  ]);

  const prioridades = { baja: 0, media: 0, alta: 0 };
  porPrioridad.forEach(({ _id, total: cantidad }) => {
    if (_id in prioridades) prioridades[_id] = cantidad;
  });

  return {
    total,
    completadas,
    pendientes: total - completadas,
    pendientesAltaPrioridad: pendientesAlta,
    porPrioridad: prioridades
  };
};

module.exports = {
  obtenerResumen,
  obtenerTodas,`);
fs.writeFileSync("src/services/tareas.service.js",s);
let c=fs.readFileSync("src/controllers/tareas.controller.js","utf8");
c=c.replace("module.exports = {\n  getTareas,",`const getResumen = async (req, res, next) => {
  try {
    const resumen = await tareasService.obtenerResumen();
    res.json(resumen);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResumen,
  getTareas,`);
fs.writeFileSync("src/controllers/tareas.controller.js",c);
let r=fs.readFileSync("src/routes/tareas.routes.js","utf8");
r=r.replace("router.get(\x27/\x27, tareasController.getTareas);","// Resumen: va antes de las rutas con :id\nrouter.get(\x27/resumen\x27, tareasController.getResumen);\nrouter.get(\x27/\x27, tareasController.getTareas);");
fs.writeFileSync("src/routes/tareas.routes.js",r);
'
git add . && git commit -q -m "feat: agregar endpoint de resumen de tareas"

# ---------------------------------------------------------------- 5 · README
cat >> README.md <<'EOF'


## Endpoints

Todos cuelgan de `/api/tareas`.

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | `/api/tareas` | Lista tareas. Filtros opcionales: `?prioridad=alta&completada=false&q=texto` |
| POST | `/api/tareas` | Crea una tarea (requiere el token en el header `Authorization`) |
| PUT | `/api/tareas/:id` | Actualiza una tarea |
| DELETE | `/api/tareas/:id` | Elimina una tarea |
| PUT | `/api/tareas/:id/completar` | Marca la tarea como completada y guarda la fecha. Si ya estaba completada responde 409 |
| PUT | `/api/tareas/:id/reabrir` | Vuelve la tarea a pendiente. Si no estaba completada responde 409 |
| GET | `/api/tareas/resumen` | Totales: total, completadas, pendientes, pendientes de prioridad alta y cantidad por prioridad |
| POST | `/api/auth/register` | Registra un usuario (contraseña hasheada con bcrypt) |
| POST | `/api/auth/login` | Verifica las credenciales |

Los errores responden `{ "error": "mensaje" }` con su status (400, 404, 409).

## Frontend

El frontend en React que consume esta API está en el repositorio `landing-pilar-tecno`.
CORS está habilitado para `http://localhost:5173` (ver `src/config/corsConfig.js`).
EOF
git add . && git commit -q -m "docs: documentar los endpoints de la api en el readme"

git checkout -q main
git merge -q --no-ff feature/endpoints-negocio -m "Merge branch 'feature/endpoints-negocio'"
echo; echo "LISTO. Historial:"; git log --oneline --graph | head -20
