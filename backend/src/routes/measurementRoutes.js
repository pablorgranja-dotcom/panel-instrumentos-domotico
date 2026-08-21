const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');
const validateRequest = require('../middlewares/validateRequest');
const measurementSchema = require('../validations/measurementSchema');

// Rutas públicas
router.get('/latest', measurementController.getLatest);
router.get('/', measurementController.getAll);

// Ruta protegida por validación Joi
router.post('/', validateRequest(measurementSchema), measurementController.create);

module.exports = router;