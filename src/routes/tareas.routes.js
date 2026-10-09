const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Resumen: va antes de las rutas con :id
router.get('/resumen', tareasController.getResumen);
router.get('/', tareasController.getTareas);
router.post('/', authMiddleware, tareasController.createTarea);

// Endpoints de negocio (van antes de '/:id' para que no se confundan con un id)
router.put('/:id/completar', tareasController.completarTarea);
router.put('/:id/reabrir', tareasController.reabrirTarea);

router.put('/:id', tareasController.updateTarea);
router.delete('/:id', tareasController.deleteTarea);

module.exports = router;
