const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas.controller');
const authMiddleware = require('../middlewares/authMiddleware');

console.log('Controller:', tareasController);
console.log('Middleware:', authMiddleware);

router.get('/', tareasController.getTareas); 
router.post('/', authMiddleware, tareasController.createTarea);
router.put('/:id', tareasController.updateTarea);
router.delete('/:id', tareasController.deleteTarea);

module.exports = router;