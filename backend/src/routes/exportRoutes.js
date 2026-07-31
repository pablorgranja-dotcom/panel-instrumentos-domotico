const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// Ruta para descargar el Excel
router.get('/excel', exportController.downloadExcel);

module.exports = router;