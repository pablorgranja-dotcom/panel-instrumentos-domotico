const express = require('express');
const router = express.Router();
const VehicleData = require('../models/VehicleData');

router.post('/save', async (req, res) => {
  try {
    const nuevoRegistro = new VehicleData(req.body);
    await nuevoRegistro.save();
    res.status(201).json({ mensaje: 'Datos guardados correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta 2: Obtener el último registro guardado
router.get('/latest', async (req, res) => {
  try {
    // Buscamos el registro más reciente ordenado por fecha
    const ultimoRegistro = await VehicleData.findOne().sort({ createdAt: -1 });
    res.json(ultimoRegistro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;